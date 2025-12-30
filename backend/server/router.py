from aiohttp import web
import logging
import os
from .library_info_handler import *
from .images_handler import *
from .migration_handler import *
logger = logging.getLogger(__name__)

def setup_routes(app: web.Application):
    
    app.router.add_get("/api/models/get_types", handle_get_model_types)
    app.router.add_get("/api/get_models", handle_get_models)
    app.router.add_get("/api/tags", handle_get_tags)


    app.router.add_get("/api/images/{hash}", handle_get_image)
    app.router.add_get("/api/images/pending/{name}", handle_get_pending_image)
    app.router.add_post("/api/images/upload", handle_upload_image)
    app.router.add_get("/api/images/get_image_count/{hash}",handle_get_image_count)
    app.router.add_get("/api/models/{sha256}", handle_get_model_details)
    app.router.add_patch("/api/models/{sha256}", handle_update_model)
    app.router.add_get("/api/models", handle_get_models)
    app.router.add_get("/api/tags", handle_get_tags)
    app.router.add_post("/api/tags_add", handle_add_tags)
    app.router.add_get("/api/images/get_img_count", handle_get_image_count)
    app.router.add_get("/api/images/{hash}.webp", handle_get_image)
    app.router.add_get("/api/images/pending/{name}.webp", handle_get_pending_image)
    app.router.add_post("/api/images/upload", handle_upload_image)
    app.router.add_delete("/api/images/delete", handle_delete_image)
    
    # Migration APIs
    app.router.add_get("/api/migration/pending_models", handle_get_pending_models)
    app.router.add_post("/api/migration/migrate_legacy_db", handle_migrate_legacy_db)
    app.router.add_post("/api/migration/import_models", handle_import_models)
    
    # Static files setup
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    static_path = os.path.join(root_dir, "web", "dist", "manager")
    
    if os.path.exists(static_path):
        async def index(request):
            return web.FileResponse(os.path.join(static_path, "index.html"))
            
        app.router.add_get("/", index)
        app.router.add_static("/", static_path, show_index=True)
    else:
        logger.warning(f"Static path not found: {static_path}")
