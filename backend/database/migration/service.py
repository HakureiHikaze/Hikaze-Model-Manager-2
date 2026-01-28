import json
import logging
import os
import shutil
import sqlite3
from dataclasses import asdict
from typing import List, Dict, Optional

from backend.database.db import DatabaseManager
from backend.util import hasher, config
from backend.util.image_processor import ImageProcessor
from backend.database.migration.legacy_database_adapter import LegacyDatabaseAdapter
from backend.util.model_type_sniffer import get_model_type_index
from shared.types.model_record import ModelRecord, PendingModelRecord, Tag
from shared.types.data_adapters import DataAdapters

logger = logging.getLogger(__name__)

class MigrationService:
    @staticmethod
    def run_legacy_migration(legacy_db_path: str, legacy_images_dir: Optional[str] = None) -> dict:
        """
        Executes the full Stage 1 migration.
        """
        # 1. Extract Data via Adapter
        adapter = LegacyDatabaseAdapter(legacy_db_path)
        active_models_data, pending_models, tag_rels, tags_map = adapter.get_all_data()
        
        # 2. Database Migration
        db = DatabaseManager()
        report = {"migrated": 0, "pending": 0, "errors": 0, "images_processed": 0, "image_errors": 0}
        
        conn = db.get_connection()
        with conn:
            # Insert Tags
            for tid, name in tags_map.items():
                db.upsert_tag_with_id(tid, name)
            
            # Insert Active Models
            for record, legacy_id, legacy_images in active_models_data:
                try:
                    # Handle Image Migration
                    if legacy_images_dir and legacy_images:
                        try:
                            filename = os.path.basename(str(legacy_images[0]))
                            src_path = os.path.join(legacy_images_dir, filename)
                            if os.path.exists(src_path):
                                with open(src_path, "rb") as f:
                                    img_data = f.read()
                                ImageProcessor.save_legacy_active_image(img_data, record.sha256)
                                record.meta_json.images_count = 1
                                report["images_processed"] += 1
                        except Exception as e:
                            logger.error(f"Failed to migrate image for {record.sha256}: {e}")
                            report["image_errors"] += 1

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
                    # Handle Pending Image Migration
                    if legacy_images_dir and record.meta_json and record.meta_json.images:
                        try:
                            filename = os.path.basename(str(record.meta_json.images[0]))
                            src_path = os.path.join(legacy_images_dir, filename)
                            if os.path.exists(src_path):
                                dest_path = os.path.join(config.PENDING_IMAGES_DIR, filename)
                                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                                shutil.copy2(src_path, dest_path)
                                report["images_processed"] += 1
                        except Exception as e:
                            logger.error(f"Failed to migrate pending image for {record.path}: {e}")
                            report["image_errors"] += 1

                    if db.add_pending_import(record):
                        # Apply pending tags
                        legacy_tag_ids = tag_rels.get(record.id, [])
                        for tid in legacy_tag_ids:
                            db.execute_non_query(
                                "INSERT OR IGNORE INTO pending_model_tags (model_id, tag_id) VALUES (?, ?)",
                                (record.id, tid)
                            )
                        report["pending"] += 1
                except Exception as e:
                    logger.error(f"Failed to migrate pending model {record.path}: {e}")
                    report["errors"] += 1
        
        status = "success"
        if report.get("errors", 0) > 0:
            status = "failed"

        return {
            "status": status,
            "db_migration": report
        }

    @staticmethod
    def get_pending_models() -> List[dict]:
        """
        Fetches and adapts pending models for the UI.
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
                tag_rows = db.get_tags_for_pending_model(record.id)
                record.tags = [Tag(t["id"], t["name"]) for t in tag_rows]
                simple = DataAdapters.full_pending_to_simple_pending(record)
                models.append(asdict(simple))
            return models
        except Exception as e:
            logger.exception("Error fetching pending models in service")
            raise

    @staticmethod
    def get_pending_model_details(item_id: int) -> Optional[PendingModelRecord]:
        """
        Fetch a PendingModelRecord by ID with tags.
        """
        db = DatabaseManager()
        return db.get_pending_model_by_id(item_id)

    @staticmethod
    def scan_models_to_pending() -> dict:
        """
        Scan model directories and add missing models into pending_import.
        """
        index = get_model_type_index()
        if not index.model_paths_by_type:
            return {
                "status": "error",
                "error": "Model type cache is empty; start ComfyUI once to initialize types cache.",
                "status_code": 503,
            }

        db = DatabaseManager()
        existing_paths = MigrationService._load_existing_paths(db)
        extensions_by_type = MigrationService._load_extensions_by_type(index.model_paths_by_type.keys())

        scanned = 0
        added = 0
        skipped = 0
        pending_ids: list[int] = []
        seen_paths: set[str] = set()

        for type_name, roots in index.model_paths_by_type.items():
            ext_set = extensions_by_type.get(type_name, set())
            for root in roots:
                if not root or not os.path.isdir(root):
                    continue
                for dirpath, _, filenames in os.walk(root):
                    for filename in filenames:
                        if ext_set:
                            ext = os.path.splitext(filename)[1].lower()
                            if ext not in ext_set:
                                continue
                        full_path = os.path.join(dirpath, filename)
                        abs_path = os.path.abspath(full_path)
                        normalized = MigrationService._normalize_path(abs_path)
                        if normalized in seen_paths:
                            continue
                        seen_paths.add(normalized)
                        scanned += 1
                        if normalized in existing_paths:
                            skipped += 1
                            continue
                        try:
                            stat = os.stat(full_path)
                        except OSError:
                            skipped += 1
                            continue

                        record = PendingModelRecord(
                            id=0,
                            path=abs_path,
                            sha256="",
                            name=os.path.basename(abs_path),
                            type=type_name,
                            size_bytes=int(stat.st_size),
                            created_at=int(stat.st_mtime * 1000),
                            meta_json=DataAdapters.dict_to_old_meta_json({})
                        )

                        pending_id = MigrationService._insert_pending_record(db, record)
                        if pending_id:
                            added += 1
                            pending_ids.append(pending_id)
                            existing_paths.add(normalized)
                        else:
                            skipped += 1

        return {
            "status": "success",
            "scanned": scanned,
            "added": added,
            "pending_ids": pending_ids,
            "skipped": skipped,
        }

    @staticmethod
    def _normalize_path(path: str) -> str:
        normalized = os.path.normpath(os.path.abspath(path))
        if os.name == "nt":
            normalized = os.path.normcase(normalized)
        return normalized

    @staticmethod
    def _load_existing_paths(db: DatabaseManager) -> set[str]:
        existing: set[str] = set()
        for row in db.execute_query("SELECT path FROM models"):
            raw = row.get("path") if isinstance(row, dict) else row["path"]
            if raw:
                existing.add(MigrationService._normalize_path(str(raw)))
        for row in db.execute_query("SELECT path FROM pending_import"):
            raw = row.get("path") if isinstance(row, dict) else row["path"]
            if raw:
                existing.add(MigrationService._normalize_path(str(raw)))
        return existing

    @staticmethod
    def _load_extensions_by_type(type_names: list[str] | set[str]) -> dict[str, set[str]]:
        try:
            import folder_paths
        except Exception:
            return {type_name: set() for type_name in type_names}

        extension_map: dict[str, set[str]] = {}
        fallback_exts = MigrationService._normalize_extensions(
            getattr(folder_paths, "supported_pt_extensions", None) or []
        )

        for type_name in type_names:
            ext_list = None
            type_entry = folder_paths.folder_names_and_paths.get(type_name)
            if type_entry:
                ext_list = type_entry[1]
            normalized = MigrationService._normalize_extensions(ext_list or [])
            extension_map[type_name] = normalized if normalized else fallback_exts

        return extension_map

    @staticmethod
    def _normalize_extensions(exts: list[str] | tuple[str, ...] | set[str]) -> set[str]:
        normalized: set[str] = set()
        for ext in exts:
            if not ext:
                continue
            ext_str = str(ext).lower()
            if "*" in ext_str:
                continue
            if not ext_str.startswith("."):
                ext_str = f".{ext_str}"
            normalized.add(ext_str)
        return normalized

    @staticmethod
    def _insert_pending_record(db: DatabaseManager, record: PendingModelRecord) -> int:
        data = DataAdapters.to_dict(record)
        if data.get("id") == 0:
            data.pop("id", None)
        data.pop("tags", None)
        data["meta_json"] = json.dumps(data.get("meta_json") or {})

        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        sql = f"INSERT INTO pending_import ({columns}) VALUES ({placeholders})"
        try:
            conn = db.get_connection()
            with conn:
                cur = conn.execute(sql, list(data.values()))
            return int(cur.lastrowid or 0)
        except sqlite3.IntegrityError:
            return 0

    @staticmethod
    def promote_pending_models(ids: List[int], conflict_strategy: Optional[str] = None) -> dict:
        """
        Executes Stage 2 promotion for a batch of IDs.
        """
        response = {"total": len(ids), "success": [], "conflict": [], "ignored": [], "deleted": [], "failed": []}

        for raw_id in ids:
            try:
                pending_id = int(raw_id)
            except:
                response["failed"].append({"id": raw_id, "error": "Invalid id"})
                continue

            result = MigrationService._promote_single_model(pending_id, conflict_strategy)
            status = result.get("status")

            if status == "success": response["success"].append(pending_id)
            elif status == "conflict": response["conflict"].append({"pending": result.get("pending"), "existing": result.get("existing")})
            elif status == "ignored": response["ignored"].append(pending_id)
            elif status == "deleted": response["deleted"].append(pending_id)
            else: response["failed"].append({"id": pending_id, "error": result.get("error", "Unknown error")})

        return response

    @staticmethod
    def _promote_single_model(pending_id: int, conflict_strategy: Optional[str]) -> dict:
        """
        Internal logic for promoting a single model.
        """
        result = {"id": pending_id}
        db = DatabaseManager()
        record = db.get_pending_model_by_id(pending_id)
        
        if not record:
            return {"status": "error", "error": "Pending model not found"}

        path = record.path
        if not path:
            return {"status": "error", "error": "Pending model missing path"}

        sha256 = hasher.get_sha256(path)
        if not sha256:
            return {"status": "error", "error": "SHA256 calculation failed"}

        record.sha256 = sha256
        tag_rows = db.execute_query("SELECT tag_id FROM pending_model_tags WHERE model_id = ?", (pending_id,))
        pending_tag_ids = [row["tag_id"] for row in tag_rows]

        existing = db.get_model_by_sha256(sha256)
        if existing and conflict_strategy is None:
            return {
                "status": "conflict",
                "sha256": sha256,
                "pending": {"id": pending_id, "path": path},
                "existing": {"id": sha256, "path": existing.path},
            }

        if conflict_strategy == "ignore":
            return {"status": "ignored", "sha256": sha256}

        if conflict_strategy == "delete":
            db.remove_pending_import(pending_id)
            return {"status": "deleted", "sha256": sha256}

        # Handle Image Promotion
        pending_image_path = None
        if record.meta_json and record.meta_json.images:
            filename = os.path.basename(str(record.meta_json.images[0]))
            src_path = os.path.join(config.PENDING_IMAGES_DIR, filename)
            if os.path.exists(src_path):
                try:
                    with open(src_path, "rb") as f:
                        image_data = f.read()

                    seq = ImageProcessor.get_next_sequence_index(sha256)
                    target_base = f"{sha256}_{seq}"
                    ImageProcessor.process_and_save(image_data, target_base, is_pending=False)

                    record.meta_json.images = []
                    pending_image_path = src_path
                except Exception as e:
                    logger.error(f"Failed to process image during promotion for {sha256}: {e}")

        # Convert OldMetaJson to MetaJson
        new_meta = DataAdapters.dict_to_meta_json(asdict(record.meta_json))
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

        # Database transaction for the final steps
        conn = db.get_connection()
        try:
            with conn:
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
                
            # Post-transaction: remove source image
            if pending_image_path:
                try:
                    os.remove(pending_image_path)
                except OSError:
                    pass
                    
            return {"status": "success", "sha256": target_sha}
        except Exception as e:
            logger.error(f"Database error during promotion of {pending_id}: {e}")
            return {"status": "error", "error": f"Database error: {str(e)}"}
