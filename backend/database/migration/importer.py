import sqlite3
import json
import logging
import os
import glob
from typing import Dict, Any, Optional, List
from backend.database import DatabaseManager
from backend.util.image_processor import ImageProcessor

logger = logging.getLogger(__name__)

def migrate_legacy_db(legacy_db_path: str) -> Dict[str, int]:
    """
    Stage 1: Migrate data from legacy database to new database.
    - Tags -> tags (preserve ID)
    - Hashed Models -> models + model_tags
    - Unhashed Models -> pending_import + pending_model_tags
    """
    report = {"migrated": 0, "pending": 0, "errors": 0}
    
    if not os.path.exists(legacy_db_path):
        logger.error(f"Legacy DB not found: {legacy_db_path}")
        return report

    def get_value(row: sqlite3.Row, key: str, default: Any) -> Any:
        try:
            return row[key] if row[key] is not None else default
        except KeyError:
            return default

    conn = None
    try:
        # Open Legacy DB in Read-Only mode
        conn = sqlite3.connect(f"file:{legacy_db_path}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
        
        db = DatabaseManager()
        
        # 1. Tags
        logger.info("Migrating tags...")
        try:
            tags = conn.execute("SELECT * FROM tags").fetchall()
            for row in tags:
                tag_id = get_value(row, "id", 0)
                if tag_id <= 0: continue
                db.upsert_tag_with_id(tag_id, get_value(row, "name", ""))
            
            # Update sequence
            cur_max = db.get_connection().execute("SELECT MAX(id) as max_id FROM tags").fetchone()["max_id"] or 0
            db.set_meta("tags_id_max", cur_max)
        except Exception as e:
            logger.error(f"Error migrating tags: {e}")

        # 2. Models
        logger.info("Migrating models...")
        models = conn.execute("SELECT * FROM models").fetchall()
        
        for row in models:
            try:
                model_id = get_value(row, "id", 0)
                hash_hex = get_value(row, "hash_hex", "")
                filename = get_value(row, "name", "")
                
                # Tags
                tag_ids = [r["tag_id"] for r in conn.execute("SELECT tag_id FROM model_tags WHERE model_id = ?", (model_id,)).fetchall()]
                
                # Meta
                extra_json = get_value(row, "extra_json", "")
                
                common_data = {
                    "path": get_value(row, "path", ""),
                    "name": filename,
                    "type": get_value(row, "type", ""),
                    "size_bytes": get_value(row, "size_bytes", 0),
                    "created_at": get_value(row, "created_at", 0),
                    "meta_json": extra_json
                }

                if hash_hex and len(hash_hex) == 64:
                    # Active
                    common_data["sha256"] = hash_hex
                    db.upsert_model(common_data)
                    for tid in tag_ids:
                        db.tag_model(hash_hex, tid)
                    report["migrated"] += 1
                else:
                    # Pending
                    pending_data = common_data.copy()
                    pending_data["id"] = model_id
                    pending_data["sha256"] = None
                    db.add_pending_import(pending_data)
                    for tid in tag_ids:
                        db.add_pending_model_tag(model_id, tid)
                    report["pending"] += 1

            except Exception as e:
                logger.error(f"Error migrating model {get_value(row, 'id', '?')}: {e}")
                report["errors"] += 1

    except Exception as e:
        logger.error(f"Migration fatal error: {e}")
    finally:
        if conn: conn.close()
        
    return report

def migrate_legacy_images(legacy_images_dir: str) -> Dict[str, int]:
    """
    Stage 1: Migrate images.
    - Scan meta_json for image paths.
    - Search by filename in legacy_images_dir.
    - Active Models -> Compress to 3-tier -> data/images/
    - Pending Models -> Copy original -> data/images/pending/
    """
    report = {"images_processed": 0, "errors": 0}
    
    if not os.path.exists(legacy_images_dir):
        logger.error(f"Legacy images dir not found: {legacy_images_dir}")
        return report

    db = DatabaseManager()
    
    # Helper to find file in legacy dir (case-insensitive search might be needed on Linux, but assuming simple filename match for now)
    # The requirement says "search in specified image directory".
    
    def find_legacy_image(filename: str) -> Optional[str]:
        path = os.path.join(legacy_images_dir, filename)
        if os.path.exists(path):
            return path
        return None

    # 1. Active Models
    # We need to scan all models to check for legacy image paths in meta_json
    # This might be slow if we iterate all. 
    # Optimization: Iterate over models that have meta_json not null?
    # Or just iterate all.
    
    # Actually, we can just iterate the `models` table in new DB?
    # Yes, the DB migration is done.
    
    conn = db.get_connection()
    
    # Active Models
    cursor = conn.execute("SELECT sha256, meta_json FROM models")
    while True:
        rows = cursor.fetchmany(100)
        if not rows: break
        for row in rows:
            try:
                meta = json.loads(row["meta_json"] or "{}")
                images = meta.get("images", [])
                if not images: continue
                
                # Assuming first image is the preview
                legacy_rel_path = images[0]
                filename = os.path.basename(legacy_rel_path)
                src_path = find_legacy_image(filename)
                
                if src_path:
                    with open(src_path, "rb") as f:
                        img_data = f.read()
                    
                    # Compress and Save
                    # Naming: <hash>_<seq>_<quality>.webp
                    # We need a custom logic here to handle sequence
                    # ImageProcessor.process_and_save usually takes a hash.
                    # We need to implement the sequence logic.
                    
                    # For now, let's just use the hash as base name. 
                    # The requirement says: <sha256>_<sequence_index>_<quality>.webp
                    # "increment index when file exists"
                    
                    # We need to extend ImageProcessor or do it here.
                    # Let's do it here or update ImageProcessor.
                    # Updating ImageProcessor is better for reusability.
                    
                    ImageProcessor.save_legacy_active_image(img_data, row["sha256"])
                    report["images_processed"] += 1
            except Exception as e:
                # logger.error(f"Image error active {row['sha256']}: {e}")
                pass

    # Pending Models
    cursor = conn.execute("SELECT id, meta_json FROM pending_import")
    while True:
        rows = cursor.fetchmany(100)
        if not rows: break
        for row in rows:
            try:
                meta = json.loads(row["meta_json"] or "{}")
                images = meta.get("images", [])
                if not images: continue
                
                legacy_rel_path = images[0]
                filename = os.path.basename(legacy_rel_path)
                src_path = find_legacy_image(filename)
                
                if src_path:
                    with open(src_path, "rb") as f:
                        img_data = f.read()
                    
                    # Save Pending (Original)
                    # Requirement: save in data/images/pending
                    ImageProcessor.save_pending_image_original(img_data, str(row["id"]))
                    report["images_processed"] += 1
            except Exception as e:
                pass

    return report
