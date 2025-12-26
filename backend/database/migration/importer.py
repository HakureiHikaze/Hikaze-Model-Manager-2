import sqlite3
import json
import logging
import os
from typing import Dict, Any, Optional
from backend.database import DatabaseManager
from backend.util.image_processor import ImageProcessor

logger = logging.getLogger(__name__)

def import_legacy_data(legacy_db_path: str, legacy_images_dir: Optional[str] = None) -> Dict[str, int]:
    """
    Import data from a legacy database.
    
    Args:
        legacy_db_path: Path to legacy MM database.
        legacy_images_dir: Optional path to directory containing legacy images.
    
    Returns:
        A report with counts.
    """
    report = {"total": 0, "migrated": 0, "pending": 0, "errors": 0, "images": 0}

    def get_value(row: sqlite3.Row, key: str, default: Any) -> Any:
        try:
            value = row[key]
        except KeyError:
            return default
        return value if value is not None else default

    def get_str(row: sqlite3.Row, key: str) -> str:
        value = get_value(row, key, "")
        return value if value is not None else ""

    def get_int(row: sqlite3.Row, key: str) -> int:
        value = get_value(row, key, 0)
        try:
            return int(value)
        except (TypeError, ValueError):
            return 0
    
    try:
        db = DatabaseManager()
        # Use DatabaseManager to get legacy connection (verified and read-only)
        legacy_conn = db.get_legacy_connection()
        
        # 1. Tags Migration
        legacy_tags_cur = legacy_conn.execute("SELECT * FROM tags")
        legacy_tag_rows = legacy_tags_cur.fetchall()
        
        for row in legacy_tag_rows:
            tag_id = get_int(row, "id")
            if tag_id <= 0:
                continue
            db.upsert_tag_with_id(
                tag_id,
                get_str(row, "name")
            )
        
        # Update tags_id_max after tag migration
        cur_tags = db.get_connection().execute("SELECT MAX(id) as max_id FROM tags")
        max_id = cur_tags.fetchone()["max_id"] or 0
        db.set_meta("tags_id_max", max_id)

        # 2. Models Migration
        models_cur = legacy_conn.execute("SELECT * FROM models")
        models = models_cur.fetchall()
        report["total"] = len(models)

        for row in models:
            try:
                model_id = get_int(row, "id")
                hash_hex = get_value(row, "hash_hex", "")
                filename = get_str(row, "name")
                
                # Fetch legacy tags
                mt_cur = legacy_conn.execute("SELECT tag_id FROM model_tags WHERE model_id = ?", (model_id,))
                tag_ids = [r["tag_id"] for r in mt_cur.fetchall()]
                
                # Image Logic
                preview_image_id = None
                extra_json = get_value(row, "extra_json", "")
                meta_json_str = extra_json # Direct copy of legacy extra_json
                
                extra_data = {}
                if extra_json:
                    try:
                        extra_data = json.loads(extra_json)
                    except (json.JSONDecodeError, TypeError):
                        extra_data = {}

                if legacy_images_dir and extra_data:
                    try:
                        legacy_imgs = extra_data.get("images", [])
                        if legacy_imgs:
                            # Take first image
                            legacy_img_rel = legacy_imgs[0]
                            legacy_img_name = os.path.basename(legacy_img_rel)
                            src_path = os.path.join(legacy_images_dir, legacy_img_name)
                            
                            if os.path.exists(src_path):
                                # Determine identifier (hash if active, else legacy model id)
                                is_active = (hash_hex and len(hash_hex) == 64)
                                identifier = hash_hex if is_active else str(model_id)
                                
                                with open(src_path, "rb") as f:
                                    img_data = f.read()
                                    
                                ImageProcessor.process_and_save(img_data, identifier, is_pending=(not is_active))
                                preview_image_id = identifier
                                report["images"] += 1
                    except Exception as img_err:
                        logger.warning(f"Failed to process legacy image for model {model_id}: {img_err}")

                # Prepare Data
                common_data = {
                    "path": get_str(row, "path"),
                    "name": filename,
                    "type": get_str(row, "type"),
                    "size_bytes": get_int(row, "size_bytes"),
                    "created_at": get_int(row, "created_at"),
                    "meta_json": meta_json_str
                }
                
                if hash_hex and len(hash_hex) == 64:
                    # Valid hash: Active record
                    common_data["sha256"] = hash_hex
                    db.upsert_model(common_data)
                    
                    # Associate tags
                    for tid in tag_ids:
                        db.tag_model(hash_hex, tid)
                    
                    report["migrated"] += 1
                else:
                    # No hash: Pending record
                    pending_data = common_data.copy()
                    pending_data["id"] = model_id
                    pending_data["sha256"] = None
                    
                    db.add_pending_import(pending_data)
                    
                    # Associate pending tags
                    for tid in tag_ids:
                        db.add_pending_model_tag(model_id, tid)
                    
                    report["pending"] += 1
                    
            except Exception as row_err:
                logger.error(f"Error processing model ID {model_id}: {row_err}")
                report["errors"] += 1
                
    except Exception as e:
        logger.error(f"Migration error: {e}")
        report["errors"] += 1
            
    return report