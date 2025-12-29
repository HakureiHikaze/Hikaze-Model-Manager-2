from aiohttp import web
import asyncio
import json
import logging
import os
from backend.util.image_processor import ImageProcessor
from backend.util import hasher
from backend.util import config
from backend.util import get_model_types
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

async def handle_get_img_num(request):
    """
    GET /api/images/get_img_num?sha256=...
    Return count of images for a model.
    """
    sha256 = request.query.get("sha256")
    if not sha256:
        return web.json_response({"error": "sha256 is required"}, status=400)
    
    count = ImageProcessor.get_image_count(sha256)
    return web.json_response({"count": count})

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
        # Save as active image (not pending) with next sequence index.
        seq = ImageProcessor.get_next_sequence_index(sha256)
        base_name = f"{sha256}_{seq}"
        ImageProcessor.process_and_save(image_data, base_name, is_pending=False)
        return web.json_response({"status": "success", "base_name": base_name})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)

async def handle_get_sample_imgs(request):
    """
    POST /api/images/get_sample_imgs
    Body: { "sha256": "...", "quality": "high|medium|low" }
    """
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)

    sha256 = data.get("sha256") or data.get("hash")
    quality = data.get("quality", "high")
    if not sha256:
        return web.json_response({"error": "sha256 is required"}, status=400)
    if isinstance(sha256, str):
        sha256 = sha256.strip()

    if quality not in ("high", "medium", "low"):
        quality = "high"

    bases = ImageProcessor.get_image_list(sha256)
    images = [
        f"/api/images/{base}.webp?quality={quality}"
        for base in bases
    ]
    return web.json_response(
        {"images": images, "quality": quality, "count": len(images)}
    )

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
            loop = asyncio.get_running_loop()
            img_report = await loop.run_in_executor(
                None, migrate_legacy_images, legacy_images_dir
            )
            
        # 3. Cleanup Meta JSON
        strip_meta_images()

        status = "success"
        if db_report.get("errors", 0) > 0 or img_report.get("errors", 0) > 0:
            status = "failed"

        return web.json_response({
            "status": status,
            "db_migration": db_report,
            "image_migration": img_report
        })
    except Exception as e:
        logger.exception("Migration error")
        return web.json_response({"error": str(e)}, status=500)

def _import_pending_model(pending_id: int, conflict_strategy: str | None) -> dict:
    result = {"id": pending_id}

    db = DatabaseManager()
    pending_row = db.get_pending_import_by_id(pending_id)
    if not pending_row:
        result.update({"status": "error", "error": "Pending model not found", "status_code": 404})
        return result

    pending = dict(pending_row)
    path = pending.get("path")
    if not path:
        result.update({"status": "error", "error": "Pending model missing path", "status_code": 500})
        return result

    sha256 = hasher.get_sha256(path)
    if not sha256:
        result.update({"status": "error", "error": "SHA256 calculation failed", "status_code": 500})
        return result

    pending["sha256"] = sha256
    pending_tags = db.get_pending_tag_ids(pending_id)

    existing = db.get_model(sha256)
    if existing and conflict_strategy is None:
        result.update(
            {
                "status": "conflict",
                "sha256": sha256,
                "pending": {"id": pending_id, "path": path},
                "existing": {"id": sha256, "path": existing["path"]},
                "status_code": 409,
            }
        )
        return result

    if conflict_strategy == "ignore":
        result.update({"status": "ignored", "sha256": sha256, "status_code": 200})
        return result

    if conflict_strategy == "delete":
        db.remove_pending_import(pending_id)
        result.update({"status": "deleted", "sha256": sha256, "status_code": 200})
        return result

    def is_empty_value(value: object) -> bool:
        if value is None:
            return True
        if isinstance(value, str):
            return value.strip() == ""
        if isinstance(value, (list, dict, tuple, set)):
            return len(value) == 0
        if isinstance(value, (int, float)):
            return value == 0
        return False

    def clean_meta_json(raw: str) -> dict:
        if not raw:
            return {}
        try:
            value = json.loads(raw)
            return value if isinstance(value, dict) else {}
        except Exception:
            return {}

    def import_meta_images(meta: dict) -> str | None:
        images = meta.get("images")
        if not isinstance(images, list) or not images:
            return None

        filename = os.path.basename(str(images[0]))
        src_path = os.path.join(config.PENDING_IMAGES_DIR, filename)
        if not os.path.exists(src_path):
            raise ValueError(f"Pending image not found: {src_path}")

        with open(src_path, "rb") as f:
            image_data = f.read()

        seq = ImageProcessor.get_next_sequence_index(sha256)
        target_base = f"{sha256}_{seq}"
        ImageProcessor.process_and_save(image_data, target_base, is_pending=False)

        meta.pop("images", None)
        return src_path

    pending_meta = clean_meta_json(pending.get("meta_json") or "")
    try:
        pending_image_path = import_meta_images(pending_meta)
    except Exception as exc:
        logger.exception("Failed to import meta images")
        result.update({"status": "error", "error": str(exc), "status_code": 500})
        return result
    pending["meta_json"] = json.dumps(pending_meta)

    def build_model_data(source: dict) -> dict:
        return {
            "sha256": source.get("sha256"),
            "path": source.get("path"),
            "name": source.get("name"),
            "type": source.get("type"),
            "size_bytes": source.get("size_bytes"),
            "created_at": source.get("created_at"),
            "meta_json": source.get("meta_json"),
        }

    if existing and conflict_strategy == "merge":
        merged = dict(existing)
        for key, value in build_model_data(pending).items():
            if key == "sha256":
                continue
            if key == "meta_json":
                if is_empty_value(merged.get(key)) and not is_empty_value(value):
                    merged[key] = value
                continue
            if is_empty_value(merged.get(key)) and not is_empty_value(value):
                merged[key] = value

        merged["sha256"] = sha256
        db.upsert_model(merged)
    else:
        db.upsert_model(build_model_data(pending))

    if existing and conflict_strategy in ("override", "merge"):
        existing_tags = db.get_tags_for_model(sha256)
        existing_tag_ids = {row["id"] for row in existing_tags}
        tag_ids = sorted(existing_tag_ids.union(pending_tags))
    else:
        tag_ids = pending_tags

    for tag_id in tag_ids:
        db.tag_model(sha256, tag_id)

    db.remove_pending_import(pending_id)
    if pending_image_path:
        try:
            os.remove(pending_image_path)
        except OSError:
            logger.warning("Failed to delete pending image: %s", pending_image_path)

    result.update(
        {"status": "success", "sha256": sha256, "status_code": 200}
    )
    return result


async def handle_import_a_model(request):
    """
    Deprecated. Use POST /api/migration/import_models instead.

    POST /api/migration/import_a_model
    Import a single model into active storage.
    Body: { "pending_id": "...", "conflict_strategy":"override|merge|delete|ignore" or null }
    """
    logger.warning("handle_import_a_model is deprecated; use /api/migration/import_models")
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)

    pending_id = data.get("id", data.get("pending_id"))
    conflict_strategy = data.get("conflict_strategy")

    if conflict_strategy == "null":
        conflict_strategy = None
    if conflict_strategy not in (None, "override", "merge", "ignore", "delete"):
        return web.json_response({"error": "Invalid conflict_strategy"}, status=400)

    try:
        pending_id = int(pending_id)
    except (TypeError, ValueError):
        return web.json_response({"error": "id is required"}, status=400)

    result = _import_pending_model(pending_id, conflict_strategy)
    status_code = result.pop("status_code", 200)
    result["deprecated"] = True
    return web.json_response(result, status=status_code)


async def handle_import_models(request):
    """
    POST /api/migration/import_models
    Import multiple pending models into active storage.
    Body: { "id": [...], "conflict_strategy":"override|merge|delete|ignore" or null }
    """
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON body"}, status=400)

    ids = data.get("id")
    conflict_strategy = data.get("conflict_strategy")

    if conflict_strategy == "null":
        conflict_strategy = None
    if conflict_strategy not in (None, "override", "merge", "ignore", "delete"):
        return web.json_response({"error": "Invalid conflict_strategy"}, status=400)

    if not isinstance(ids, list) or len(ids) == 0:
        return web.json_response({"error": "id must be a non-empty array"}, status=400)

    response = {
        "total": len(ids),
        "success": [],
        "conflict": [],
        "ignored": [],
        "deleted": [],
        "failed": [],
    }

    for raw_id in ids:
        try:
            pending_id = int(raw_id)
        except (TypeError, ValueError):
            response["failed"].append({"id": raw_id, "error": "Invalid id"})
            continue

        result = _import_pending_model(pending_id, conflict_strategy)
        status = result.get("status")

        if status == "success":
            response["success"].append(pending_id)
        elif status == "conflict":
            response["conflict"].append(
                {
                    "pending": result.get("pending"),
                    "existing": result.get("existing"),
                }
            )
        elif status == "ignored":
            response["ignored"].append(pending_id)
        elif status == "deleted":
            response["deleted"].append(pending_id)
        else:
            response["failed"].append(
                {"id": pending_id, "error": result.get("error", "Unknown error")}
            )

    return web.json_response(response, status=207)

def setup_routes(app: web.Application):
    app.router.add_get("/api/hello", handle_hello)
    app.router.add_get("/api/models/get_types", handle_get_model_types)
    app.router.add_get("/api/models/{sha256}", handle_get_model_details)
    app.router.add_get("/api/models", handle_get_models)
    app.router.add_get("/api/tags", handle_get_tags)
    app.router.add_get("/api/images/get_img_num", handle_get_img_num)
    app.router.add_get("/api/images/{hash}.webp", handle_get_image)
    app.router.add_get("/api/images/pending/{name}.webp", handle_get_pending_image)
    app.router.add_post("/api/images/upload", handle_upload_image)
    app.router.add_post("/api/images/get_sample_imgs", handle_get_sample_imgs)
    
    # Migration APIs
    app.router.add_get("/api/migration/pending_models", handle_get_pending_models)
    app.router.add_post("/api/migration/migrate_legacy_db", handle_migrate_legacy_db)
    app.router.add_post("/api/migration/import_a_model", handle_import_a_model)
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
