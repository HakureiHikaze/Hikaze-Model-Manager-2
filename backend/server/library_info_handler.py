import logging
import sqlite3
import json
from aiohttp import web
from dataclasses import asdict

from backend.database.db import DatabaseManager
from backend.util.model_type_sniffer import get_model_types
from shared.types.data_adapters import DataAdapters
from shared.types.model_record import ModelRecord

logger = logging.getLogger(__name__)

async def handle_get_model_types(request):
    """
    GET /api/models/get_types
    Return available model type keys.
    """
    return web.json_response({"types": list(get_model_types())})


async def handle_get_tags(request):
    """
    GET /api/tags
    Return all available tags in the system.
    """
    db = DatabaseManager()
    try:
        raw_tags = db.get_all_tags()
        tags = [{"id": t["id"], "name": t["name"]} for t in raw_tags]
        return web.json_response({"tags": tags})
    except Exception as e:
        logger.exception("Error fetching tags")
        return web.json_response({"error": str(e)}, status=500)
    
async def handle_add_tags(request):
    """
    POST /api/tags_add
    Body: { "newtags": ["name1", "name2"] }
    Returns: { "tags": [{ "id": 1, "name": "name1" }, ...] }
    """
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)
        
    new_tags = data.get("newtags")
    if not isinstance(new_tags, list):
        return web.json_response({"error": "newtags must be a list"}, status=400)
        
    db = DatabaseManager()
    created_tags = []
    
    for name in new_tags:
        if not isinstance(name, str) or not name.strip():
            continue
        
        name = name.strip()
        # Try to create
        try:
            tag = db.create_tag(name)
            created_tags.append({"id": tag["id"], "name": tag["name"]})
        except sqlite3.IntegrityError:
            # Already exists
            tag = db.get_tag(name)
            if tag:
                created_tags.append({"id": tag["id"], "name": tag["name"]})
            else:
                logger.warning(f"Tag {name} failed creation but not found?")
        except Exception as e:
            logger.error(f"Error creating tag {name}: {e}")
            
    return web.json_response({"tags": created_tags})    

async def handle_get_models(request):
    """
    GET /api/models?type=...
    List models by type. Returns simplified objects for the library view.
    """
    model_type = request.query.get("type")
    if not model_type:
        return web.json_response({"error": "type parameter is required"}, status=400)

    db = DatabaseManager()
    try:
        if model_type.lower() == "others":
            system_types = list(get_model_types())
            raw_models = db.get_other_models(system_types)
        else:
            raw_models = db.get_models_by_type(model_type)
            
        # Refactor: Use Dataclasses
        models = []
        for m in raw_models:
            # 1. Parse raw DB dict (with meta_json string) into ModelRecord
            # Note: DatabaseManager currently returns dicts where meta_json is a string or already parsed dict?
            # Looking at db.py: it returns dict(row). sqlite3 row access.
            # meta_json in DB is TEXT. we need to parse it if it's a string before passing to adapter
            # OR adapter handles it? DataAdapters.dict_to_model_record expects a dict structure for meta_json key?
            
            m_dict = dict(m)
            if isinstance(m_dict.get("meta_json"), str):
                 try:
                     m_dict["meta_json"] = json.loads(m_dict["meta_json"])
                 except:
                     m_dict["meta_json"] = {}
            
            record = DataAdapters.dict_to_model_record(m_dict)
            
            # 2. Convert to Simple Record
            simple = DataAdapters.full_model_to_simple_model(record)
            
            # 3. Add tags (kept separate in DB response for now)
            simple_dict = asdict(simple)
            simple_dict["tags"] = m.get("tags", [])
            models.append(simple_dict)
            
        return web.json_response({"models": models})
    except Exception as e:
        logger.exception("Error fetching models")
        return web.json_response({"error": str(e)}, status=500)



async def handle_get_model_details(request):
    """
    GET /api/models/{sha256}
    Return full details for a specific model.
    """
    sha256 = request.match_info.get("sha256", "")
    if not sha256:
        return web.json_response({"error": "sha256 is required"}, status=400)

    db = DatabaseManager()
    try:
        row = db.get_model(sha256)
        if not row:
            return web.json_response({"error": "Model not found"}, status=404)
        
        m_dict = dict(row)
        # Handle JSON parsing
        if isinstance(m_dict.get("meta_json"), str):
             try:
                 m_dict["meta_json"] = json.loads(m_dict["meta_json"])
             except:
                 m_dict["meta_json"] = {}

        # Convert to Dataclass
        record = DataAdapters.dict_to_model_record(m_dict)
        
        # Back to dict for response
        response_dict = DataAdapters.to_dict(record)
        
        # Fetch tags
        tags_rows = db.get_tags_for_model(sha256)
        response_dict["tags"] = [dict(t) for t in tags_rows]
        
        return web.json_response(response_dict)
    except Exception as e:
        logger.exception(f"Error fetching model details for {sha256}")
        return web.json_response({"error": str(e)}, status=500)
    
async def handle_update_model(request):
    """
    PATCH /api/models/{sha256}
    Body: { "name": "...", "type": "...", "tags": [id1, id2], "meta_json": ... }
    """
    sha256 = request.match_info.get("sha256", "")
    if not sha256:
        return web.json_response({"error": "sha256 is required"}, status=400)

    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)
        
    db = DatabaseManager()
    
    # 1. Check existence
    existing_row = db.get_model(sha256)
    if not existing_row:
        return web.json_response({"error": "Model not found"}, status=404)
        
    existing = dict(existing_row)
    if isinstance(existing.get("meta_json"), str):
        try:
            existing["meta_json"] = json.loads(existing["meta_json"])
        except:
            existing["meta_json"] = {}
            
    # Convert to record to ensure we are working with typed object
    record = DataAdapters.dict_to_model_record(existing)
    
    # 2. Update logic (using dataclass)
    has_changes = False
    
    if "name" in data:
        record.name = data["name"]
        has_changes = True
    if "type" in data:
        record.type = data["type"]
        has_changes = True
    if "meta_json" in data:
        # data["meta_json"] comes from frontend, likely a dict.
        # We need to parse it into MetaJson dataclass using adapter
        new_meta = DataAdapters.dict_to_meta_json(data["meta_json"])
        record.meta_json = new_meta
        has_changes = True
            
    # 3. Apply model updates
    if has_changes:
        try:
            # We need to serialize record back to dict for legacy upsert_model
            # upsert_model expects flattened dict where meta_json is a string
            update_dict = DataAdapters.to_dict(record)
            # Serialize meta_json object to string for DB storage
            update_dict["meta_json"] = json.dumps(update_dict["meta_json"])
            
            db.upsert_model(update_dict)
        except Exception as e:
            logger.error(f"Error updating model {sha256}: {e}")
            return web.json_response({"error": f"Database update failed: {str(e)}"}, status=500)
            
    # 4. Handle Tags (unchanged logic)
    if "tags" in data:
        new_tag_ids = data["tags"]
        if not isinstance(new_tag_ids, list):
             return web.json_response({"error": "tags must be a list of IDs"}, status=400)
             
        try:
            current_tags = db.get_tags_for_model(sha256)
            for t in current_tags:
                db.untag_model(sha256, t["id"])
            
            for tag_id in new_tag_ids:
                try:
                    tid = int(tag_id)
                    db.tag_model(sha256, tid)
                except ValueError:
                    pass
        except Exception as e:
            logger.error(f"Error updating tags for {sha256}: {e}")
            return web.json_response({"error": f"Tag update failed: {str(e)}"}, status=500)
            
    # 5. Return updated model
    try:
        updated_row = db.get_model(sha256)
        m_dict = dict(updated_row)
        if isinstance(m_dict.get("meta_json"), str):
             try:
                 m_dict["meta_json"] = json.loads(m_dict["meta_json"])
             except:
                 m_dict["meta_json"] = {}
                 
        updated_record = DataAdapters.dict_to_model_record(m_dict)
        result = DataAdapters.to_dict(updated_record)
        
        tags_rows = db.get_tags_for_model(sha256)
        result["tags"] = [dict(t) for t in tags_rows]
        return web.json_response(result)
    except Exception as e:
        logger.exception(f"Error fetching updated model {sha256}")
        return web.json_response({"error": str(e)}, status=500)