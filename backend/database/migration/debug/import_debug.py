import sys
import os
import sqlite3
import logging
import json

# Setup path to import backend modules
# File is at: backend/database/migration/debug/import_debug.py
current_dir = os.path.dirname(os.path.abspath(__file__))
# 1. debug, 2. migration, 3. database, 4. backend, 5. root
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))))

if root_dir not in sys.path:
    sys.path.append(root_dir)

# Override DB Path BEFORE importing config/database
# Target: root/data/db.sqlite3
os.environ["HIKAZE_DB_PATH"] = "db.sqlite3" 

from backend.database import DatabaseManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DebugImporter")

LEGACY_DB_PATH = r"D:\programming\ComfyUI251210\db_migration\hikaze_mm.sqlite3"
TARGET_PREFIX = r"D:\programming\ComfyUI251210\db_migration\debug_models"

def run_debug_import():
    logger.info(f"Starting Debug Import...")
    
    if not os.path.exists(LEGACY_DB_PATH):
        logger.error(f"Legacy DB not found: {LEGACY_DB_PATH}")
        return

    # Init DB
    db_mgr = DatabaseManager()
    db_mgr.init_db()
    logger.info(f"Target Database: {db_mgr.db_path}")
    
    conn = sqlite3.connect(LEGACY_DB_PATH)
    conn.row_factory = sqlite3.Row
    
    # Select only checkpoints
    # User specified query for 'checkpoints' type
    query = "SELECT * FROM models WHERE type = 'checkpoints'"
    cur = conn.execute(query)
    rows = cur.fetchall()
    logger.info(f"Found {len(rows)} potential checkpoint records in legacy DB")
    
    count_migrated = 0
    count_pending = 0
    
    for row in rows:
        original_path = row["path"]
        
        # Rewrite Path
        norm_path = original_path.replace("/", "\\")
        parts = norm_path.split("\\models\\")
        
        if len(parts) > 1:
            suffix = parts[-1]
            new_path = os.path.join(TARGET_PREFIX, suffix)
        else:
            logger.warning(f"Skipping path (pattern match failed): {original_path}")
            continue

        hash_hex = row["hash_hex"]
        
        if hash_hex and len(hash_hex) == 64:
            # Valid hash: Import to models table
            model_data = {
                "sha256": hash_hex,
                "path": new_path,
                "name": row["name"],
                "type": "CHECKPOINT",
                "base": "Unknown",
                "size_bytes": row["size_bytes"],
                "created_at": row["created_at"],
                "meta_json": row["meta_json"] or "{}"
            }
            try:
                db_mgr.upsert_model(model_data)
                count_migrated += 1
            except Exception as e:
                logger.error(f"Failed to insert model {row['name']}: {e}")
        else:
            # No valid hash: Import to pending_import table
            pending_data = {
                "path": new_path,
                "name": row["name"],
                "type": "CHECKPOINT",
                "created_at": row["created_at"],
                "legacy_tags_json": "[]" # Dummy tags for debug
            }
            try:
                db_mgr.add_pending_import(pending_data)
                count_pending += 1
            except Exception as e:
                logger.error(f"Failed to insert pending {row['name']}: {e}")

        if (count_migrated + count_pending) % 100 == 0:
            logger.info(f"Processed {count_migrated + count_pending} items...")

    logger.info(f"Debug Import Complete.")
    logger.info(f"Summary: {count_migrated} Migrated, {count_pending} Pending.")
    conn.close()

if __name__ == "__main__":
    run_debug_import()