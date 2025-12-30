import asyncio
import json
from logging import config
import logging
import os
from aiohttp import web

from backend.database.db import DatabaseManager
from backend.util import hasher
from backend.util.image_processor import ImageProcessor

from backend.database.migration.importer import migrate_legacy_db, migrate_legacy_images, strip_meta_images

logger = logging.getLogger(__name__)

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