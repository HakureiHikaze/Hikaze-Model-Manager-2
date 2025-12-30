from aiohttp import web
from .router import logger

from backend.database.db import DatabaseManager
from backend.util.model_type_sniffer import get_model_types
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

async def handle_get_pending_models(request):
    """
    GET /api/migration/pending_models
    List pending models from the NEW database (staging area).
    """
    db = DatabaseManager()
    try:
        pending = db.get_pending_imports()
        # Convert rows to dicts
        return web.json_response({
            "models": [dict(row) for row in pending]
        })
    except Exception as e:
        logger.exception("Error fetching pending models")
        return web.json_response({"error": str(e)}, status=500)
