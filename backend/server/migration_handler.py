import asyncio
import json
import logging
import os
from aiohttp import web
from dataclasses import asdict

from backend.database.db import DatabaseManager
from backend.util import hasher
from backend.util.image_processor import ImageProcessor
from backend.util import config

from backend.database.migration.legacy_database_adapter import LegacyDatabaseAdapter
from backend.database.migration.importer import migrate_legacy_images, strip_meta_images
from shared.types.model_record import ModelRecord, PendingModelRecord
from shared.types.data_adapters import DataAdapters

logger = logging.getLogger(__name__)

async def handle_migrate_legacy_db(request):
    """
    POST /api/migration/migrate_legacy_db
    Stage 1: Import Legacy Data and Images (One-Time).
    Utilizes LegacyDatabaseAdapter for extraction.
    """
    try:
        data = await request.json()
        legacy_db_path = data.get("legacy_db_path")
        legacy_images_dir = data.get("legacy_images_dir")
        
        if not legacy_db_path:
            return web.json_response({"error": "legacy_db_path is required"}, status=400)
            
        # 1. Extract Data via Adapter
        adapter = LegacyDatabaseAdapter(legacy_db_path)
        active_models_data, pending_models, tag_rels, tags_map = adapter.get_all_data()
        
        # 2. Database Migration
        db = DatabaseManager()
        report = {"migrated": 0, "pending": 0, "errors": 0}
        
        # Insert Tags
        for tid, name in tags_map.items():
            db.upsert_tag_with_id(tid, name)
        
        # Insert Active Models
        for record, legacy_id in active_models_data:
            try:
                db.upsert_model(record)
                # Apply tags (legacy used model_id, new uses sha256)
                legacy_tag_ids = tag_rels.get(legacy_id, [])
                for tid in legacy_tag_ids:
                    db.tag_model(record.sha256, tid)
                report["migrated"] += 1
            except Exception as e:
                logger.error(f"Failed to migrate active model {record.sha256}: {e}")
                report["errors"] += 1
                
        # Insert Pending Models
        for record in pending_models:
            try:
                if db.add_pending_import(record):
                    # Apply pending tags
                    legacy_tag_ids = tag_rels.get(record.id, [])
                    for tid in legacy_tag_ids:
                        # DatabaseManager uses execute_non_query for pending tags usually
                        db.execute_non_query(
                            "INSERT OR IGNORE INTO pending_model_tags (model_id, tag_id) VALUES (?, ?)",
                            (record.id, tid)
                        )
                    report["pending"] += 1
            except Exception as e:
                logger.error(f"Failed to migrate pending model {record.path}: {e}")
                report["errors"] += 1
        
        # 3. Migrate Images (optional if dir provided)
        img_report = {}
        if legacy_images_dir:
            loop = asyncio.get_running_loop()
            img_report = await loop.run_in_executor(
                None, migrate_legacy_images, legacy_images_dir
            )
            
        # 4. Cleanup Meta JSON
        strip_meta_images()

        status = "success"
        if report.get("errors", 0) > 0 or img_report.get("errors", 0) > 0:
            status = "failed"

        return web.json_response({
            "status": status,
            "db_migration": report,
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
        rows = db.execute_query("SELECT * FROM pending_import ORDER BY created_at")
        models = []
        for row in rows:
            m_dict = dict(row)
            if isinstance(m_dict.get("meta_json"), str):
                try:
                    m_dict["meta_json"] = json.loads(m_dict["meta_json"])
                except:
                    m_dict["meta_json"] = {}
            record = DataAdapters.dict_to_pending_model_record(m_dict)
            models.append(DataAdapters.to_dict(record))
            
        return web.json_response({"models": models})
    except Exception as e:
        logger.exception("Error fetching pending models")
        return web.json_response({"error": str(e)}, status=500)

def _import_pending_model(pending_id: int, conflict_strategy: str | None) -> dict:
    result = {"id": pending_id}

    db = DatabaseManager()
    record = db.get_pending_model_by_id(pending_id)
    if not record:
        result.update({"status": "error", "error": "Pending model not found", "status_code": 404})
        return result

    path = record.path
    if not path:
        result.update({"status": "error", "error": "Pending model missing path", "status_code": 500})
        return result

    sha256 = hasher.get_sha256(path)
    if not sha256:
        result.update({"status": "error", "error": "SHA256 calculation failed", "status_code": 500})
        return result

    record.sha256 = sha256
    tag_rows = db.execute_query("SELECT tag_id FROM pending_model_tags WHERE model_id = ?", (pending_id,))
    pending_tag_ids = [row["tag_id"] for row in tag_rows]

    existing = db.get_model_by_sha256(sha256)
    if existing and conflict_strategy is None:
        result.update(
            {
                "status": "conflict",
                "sha256": sha256,
                "pending": {"id": pending_id, "path": path},
                "existing": {"id": sha256, "path": existing.path},
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

    def import_meta_images(record: PendingModelRecord) -> str | None:
        if not record.meta_json or not record.meta_json.images:
            return None

        filename = os.path.basename(str(record.meta_json.images[0]))
        src_path = os.path.join(config.PENDING_IMAGES_DIR, filename)
        if not os.path.exists(src_path):
            return None

        with open(src_path, "rb") as f:
            image_data = f.read()

        seq = ImageProcessor.get_next_sequence_index(sha256)
        target_base = f"{sha256}_{seq}"
        ImageProcessor.process_and_save(image_data, target_base, is_pending=False)

        record.meta_json.images = []
        return src_path

    pending_image_path = import_meta_images(record)

    # Convert OldMetaJson (pending) to MetaJson (active)
    new_meta = DataAdapters.dict_to_meta_json(asdict(record.meta_json))
    
    # FIX: Set images_count if we successfully imported an image
    if pending_image_path:
        new_meta.images_count = 1

    active_record = ModelRecord(
        sha256=record.sha256,
        path=record.path,
        name=record.name,
        type=record.type,
        size_bytes=record.size_bytes,
        created_at=record.created_at,
        meta_json=new_meta
    )

    if existing and conflict_strategy == "merge":
        if not existing.name and active_record.name: existing.name = active_record.name
        if not existing.type and active_record.type: existing.type = active_record.type
        if not existing.meta_json.description and active_record.meta_json.description:
            existing.meta_json.description = active_record.meta_json.description
        db.upsert_model(existing)
        target_sha = existing.sha256
    else:
        db.upsert_model(active_record)
        target_sha = active_record.sha256

    final_tag_ids = set(pending_tag_ids)
    if existing and conflict_strategy in ("override", "merge"):
        existing_tags = db.get_tags_for_model(sha256)
        for t in existing_tags:
            final_tag_ids.add(t["id"])

    for tid in final_tag_ids:
        db.tag_model(target_sha, tid)

    db.remove_pending_import(pending_id)
    if pending_image_path:
        try:
            os.remove(pending_image_path)
        except OSError:
            pass

    result.update({"status": "success", "sha256": target_sha, "status_code": 200})
    return result

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

    response = {"total": len(ids), "success": [], "conflict": [], "ignored": [], "deleted": [], "failed": []}

    for raw_id in ids:
        try:
            pending_id = int(raw_id)
        except:
            response["failed"].append({"id": raw_id, "error": "Invalid id"})
            continue

        result = _import_pending_model(pending_id, conflict_strategy)
        status = result.get("status")

        if status == "success": response["success"].append(pending_id)
        elif status == "conflict": response["conflict"].append({"pending": result.get("pending"), "existing": result.get("existing")})
        elif status == "ignored": response["ignored"].append(pending_id)
        elif status == "deleted": response["deleted"].append(pending_id)
        else: response["failed"].append({"id": pending_id, "error": result.get("error", "Unknown error")})

    return web.json_response(response, status=207)
