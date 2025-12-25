import sqlite3
import json
import logging
import os
from typing import Dict, Any, List, Optional
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
    
    try:
        legacy_conn = sqlite3.connect(legacy_db_path)
        legacy_conn.row_factory = sqlite3.Row
        
        # Map legacy tag ID -> tag data
        legacy_tags_cur = legacy_conn.execute("SELECT * FROM tags")
        legacy_tag_map = {row["id"]: {"name": row["name"], "color": row["color"]} for row in legacy_tags_cur.fetchall()}
        
        # Get models
        models_cur = legacy_conn.execute("SELECT * FROM models")
        models = models_cur.fetchall()
        report["total"] = len(models)
        
        db = DatabaseManager()
        
        for row in models:
            try:
                model_id = row["id"]
                hash_hex = row["hash_hex"]
                filename = row["name"]
                
                # Fetch tags
                mt_cur = legacy_conn.execute("SELECT tag_id FROM model_tags WHERE model_id = ?", (model_id,))
                tag_ids = [r["tag_id"] for r in mt_cur.fetchall()]
                tag_names = [legacy_tag_map[tid]["name"] for tid in tag_ids if tid in legacy_tag_map]
                
                # Image Logic
                preview_id = None
                extra_json = row["extra_json"]
                if legacy_images_dir and extra_json:
                    try:
                        extra_data = json.loads(extra_json)
                        legacy_imgs = extra_data.get("images", [])
                        if legacy_imgs:
                            # Take first image
                            legacy_img_rel = legacy_imgs[0]
                            legacy_img_name = os.path.basename(legacy_img_rel)
                            src_path = os.path.join(legacy_images_dir, legacy_img_name)
                            
                            if os.path.exists(src_path):
                                # Determine identifier for processing (hash if exists, else name)
                                identifier = hash_hex if (hash_hex and len(hash_hex) == 64) else os.path.splitext(filename)[0]
                                is_pending = not (hash_hex and len(hash_hex) == 64)
                                
                                with open(src_path, "rb") as f:
                                    img_data = f.read()
                                    
                                preview_id = ImageProcessor.process_and_save(img_data, identifier, is_pending=is_pending)
                                report["images"] += 1
                    except Exception as img_err:
                        logger.warning(f"Failed to process legacy image for model {model_id}: {img_err}")

                # Prepare common meta
                meta = {}
                if row["meta_json"]:
                    try:
                        meta = json.loads(row["meta_json"])
                    except:
                        pass
                
                if preview_id:
                    meta["preview_image"] = preview_id

                # Prepare common data
                model_data = {
                    "path": row["path"],
                    "name": filename,
                    "type": row["type"],
                    "size_bytes": row["size_bytes"],
                    "created_at": row["created_at"],
                    "meta_json": json.dumps(meta)
                }
                
                if hash_hex and len(hash_hex) == 64:
                    # Valid hash: Import directly
                    model_data["sha256"] = hash_hex
                    db.upsert_model(model_data)
                    
                    # Import tags
                    for tid in tag_ids:
                        if tid in legacy_tag_map:
                            tdata = legacy_tag_map[tid]
                            tag_row = db.get_tag(tdata["name"])
                            if not tag_row:
                                tag_row = db.create_tag(tdata["name"], tdata["color"])
                            db.tag_model(hash_hex, tag_row["id"])
                    
                    report["migrated"] += 1
                else:
                    # No hash: Pending Import
                    pending_data = {
                        "path": row["path"],
                        "name": filename,
                        "type": row["type"],
                        "created_at": row["created_at"],
                        "legacy_tags_json": json.dumps(tag_names)
                        # pending_import table doesn't have meta_json currently, 
                        # but maybe it should? The spec didn't mention it.
                        # For now, we follow the existing schema.
                    }
                    db.add_pending_import(pending_data)
                    report["pending"] += 1
                    
            except Exception as row_err:
                logger.error(f"Error processing model ID {model_id}: {row_err}")
                report["errors"] += 1
                
    except Exception as e:
        logger.error(f"Migration error: {e}")
        report["errors"] += 1
    finally:
        if 'legacy_conn' in locals():
            legacy_conn.close()
            
    return report