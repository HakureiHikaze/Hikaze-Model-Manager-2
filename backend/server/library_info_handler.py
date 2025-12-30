import logging
import sqlite3
from aiohttp import web

from backend.database.db import DatabaseManager
from backend.util.model_type_sniffer import get_model_types
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
            
        # Simplify response: exclude heavy meta_json
        models = []
        for m in raw_models:
            models.append({
                "sha256": m.get("sha256"),
                "name": m.get("name"),
                "type": m.get("type"),
                "path": m.get("path"),
                "size_bytes": m.get("size_bytes"),
                "created_at": m.get("created_at"),
                "tags": m.get("tags", []),
            })
            
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
        
        model = dict(row)
        # Fetch tags
        tags_rows = db.get_tags_for_model(sha256)
        model["tags"] = [dict(t) for t in tags_rows]
        
        return web.json_response(model)
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
    
    # 2. Prepare update data
    updatable_fields = ["name", "path", "type", "meta_json"]
    has_changes = False
    
    for field in updatable_fields:
        if field in data:
            existing[field] = data[field]
            has_changes = True
            
    # 3. Apply model updates
    if has_changes:
        try:
            db.upsert_model(existing)
        except Exception as e:
            logger.error(f"Error updating model {sha256}: {e}")
            return web.json_response({"error": f"Database update failed: {str(e)}"}, status=500)
            
    # 4. Handle Tags
    if "tags" in data:
        new_tag_ids = data["tags"]
        if not isinstance(new_tag_ids, list):
             return web.json_response({"error": "tags must be a list of IDs"}, status=400)
             
        try:
            current_tags = db.get_tags_for_model(sha256)
            for t in current_tags:
                db.untag_model(sha256, t["id"])
            
            for tag_id in new_tag_ids:
                # Use explicit int cast if needed, though JSON decoder usually gives int
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
        result = dict(updated_row)
        tags_rows = db.get_tags_for_model(sha256)
        result["tags"] = [dict(t) for t in tags_rows]
        return web.json_response(result)
    except Exception as e:
        logger.exception(f"Error fetching updated model {sha256}")
        return web.json_response({"error": str(e)}, status=500)