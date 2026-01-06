import asyncio
import logging
from aiohttp import web

from backend.database.migration.service import MigrationService

logger = logging.getLogger(__name__)

async def handle_migrate_legacy_db(request):
    """
    POST /api/migration/migrate_legacy_db
    Stage 1: Import Legacy Data and Images (One-Time).
    """
    try:
        data = await request.json()
        legacy_db_path = data.get("legacy_db_path")
        legacy_images_dir = data.get("legacy_images_dir")
        
        if not legacy_db_path:
            return web.json_response({"error": "legacy_db_path is required"}, status=400)
            
        loop = asyncio.get_running_loop()
        report = await loop.run_in_executor(
            None, MigrationService.run_legacy_migration, legacy_db_path, legacy_images_dir
        )
        
        return web.json_response(report)
    except Exception as e:
        logger.exception("Migration error in handler")
        return web.json_response({"error": str(e)}, status=500)
    
async def handle_get_pending_models(request):
    """
    GET /api/migration/pending_models
    List pending models from the NEW database (staging area).
    """
    try:
        models = MigrationService.get_pending_models()
        return web.json_response({"models": models})
    except Exception as e:
        logger.exception("Error fetching pending models in handler")
        return web.json_response({"error": str(e)}, status=500)

async def handle_import_models(request):
    """
    POST /api/migration/import_models
    Import multiple pending models into active storage.
    """
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)

    ids = data.get("id")
    conflict_strategy = data.get("conflict_strategy")
    if conflict_strategy == "null": conflict_strategy = None

    if not isinstance(ids, list) or len(ids) == 0:
        return web.json_response({"error": "id must be a non-empty array"}, status=400)

    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(
        None, MigrationService.promote_pending_models, ids, conflict_strategy
    )

    return web.json_response(response, status=207)