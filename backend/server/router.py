from aiohttp import web
import logging
import os
from backend.util.image_processor import ImageProcessor
from backend.database import DatabaseManager
from backend.database.migration.importer import (
    migrate_legacy_db,
    migrate_legacy_images,
    strip_meta_images,
)

logger = logging.getLogger(__name__)

async def handle_hello(request):
    return web.json_response({
        "status": "ok"
    })

async def handle_get_image(request):
    """
    Serve an active image by hash.
    URL: /api/images/{hash}.webp?quality=high|medium|low
    """
    img_hash = request.match_info.get("hash", "")
    quality = request.query.get("quality", "high")
    
    path = ImageProcessor.get_image_path(img_hash, quality=quality, is_pending=False)
    if os.path.exists(path):
        return web.FileResponse(path)
    return web.Response(status=404, text="Image not found")

async def handle_get_pending_image(request):
    """
    Serve a pending image by name.
    URL: /api/images/pending/{name}.webp?quality=high|medium|low
    """
    name = request.match_info.get("name", "")
    quality = request.query.get("quality", "high")
    
    path = ImageProcessor.get_image_path(name, quality=quality, is_pending=True)
    if os.path.exists(path):
        return web.FileResponse(path)
    return web.Response(status=404, text="Pending image not found")

async def handle_upload_image(request):
    """
    Upload and process an image.
    Fields: 'image' (file), 'sha256' (text).
    """
    if not request.content_type.startswith("multipart/"):
        return web.json_response({"error": "Content-Type must be multipart/form-data"}, status=400)

    try:
        reader = await request.multipart()
    except ValueError:
        return web.json_response({"error": "Invalid multipart request"}, status=400)

    image_data = None
    sha256 = ""

    while True:
        part = await reader.next()
        if part is None:
            break
        
        if part.name == "sha256":
            sha256 = await part.text()
        elif part.name == "image":
            image_data = await part.read()
    
    if not image_data or not sha256:
        return web.json_response({"error": "Missing image or sha256"}, status=400)

    try:
        # Save as active image (not pending)
        base_name = ImageProcessor.process_and_save(image_data, sha256, is_pending=False)
        return web.json_response({"status": "success", "base_name": base_name})
    except Exception as e:
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

async def handle_migrate_legacy_db(request):
    """
    POST /api/migration/migrate_legacy_db
    Stage 1: Import Legacy Data and Images (One-Time).
    Body: { "legacy_db_path": "...", "legacy_images_dir": "..." }
    """
    try:
        data = await request.json()
        legacy_db_path = data.get("legacy_db_path")
        legacy_images_dir = data.get("legacy_images_dir")
        
        if not legacy_db_path:
            return web.json_response({"error": "legacy_db_path is required"}, status=400)
            
        # 1. Migrate DB
        db_report = migrate_legacy_db(legacy_db_path)
        
        # 2. Migrate Images (optional if dir provided)
        img_report = {}
        if legacy_images_dir:
            img_report = migrate_legacy_images(legacy_images_dir)
            
        # 3. Cleanup Meta JSON
        strip_meta_images()
            
        return web.json_response({
            "status": "success",
            "db_migration": db_report,
            "image_migration": img_report
        })
    except Exception as e:
        logger.exception("Migration error")
        return web.json_response({"error": str(e)}, status=500)

async def handle_import_a_model(request):
    """
    POST /api/migration/import_a_model
    Import a single model into active storage.
    Body: { "pending_id": "...", "conflict_strategy":"override|merge|delete|ignore" or null }
    """
    try:
        data = await request.json()
        pending_id = data.get("pending_id")
        conflict_strategy = data.get("conflict_strategy", "ignore")
    except Exception as e:
        logger.exception("Error importing model")
        return web.json_response({"error": str(e)}, status=500)

def setup_routes(app: web.Application):
    app.router.add_get("/api/hello", handle_hello)
    app.router.add_get("/api/images/{hash}.webp", handle_get_image)
    app.router.add_get("/api/images/pending/{name}.webp", handle_get_pending_image)
    app.router.add_post("/api/images/upload", handle_upload_image)
    
    # Migration APIs
    app.router.add_get("/api/migration/pending_models", handle_get_pending_models)
    app.router.add_post("/api/migration/migrate_legacy_db", handle_migrate_legacy_db)
    
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
