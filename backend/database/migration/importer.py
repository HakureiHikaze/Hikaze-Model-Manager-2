import sqlite3
import json
import logging
from typing import Dict, Any, List
from backend.database import DatabaseManager

logger = logging.getLogger(__name__)

def import_legacy_data(legacy_db_path: str) -> Dict[str, int]:
    """
    Import data from a legacy database.
    
    Returns a report with counts.
    """
    report = {"total": 0, "migrated": 0, "pending": 0, "errors": 0}
    
    try:
        legacy_conn = sqlite3.connect(legacy_db_path)
        legacy_conn.row_factory = sqlite3.Row
        
        # We need a way to look up tags by ID to preserve them
        # Let's map legacy tag ID -> tag name
        legacy_tags_cur = legacy_conn.execute("SELECT * FROM tags")
        legacy_tag_map = {row["id"]: {"name": row["name"], "color": row["color"]} for row in legacy_tags_cur.fetchall()}
        
        # Get models
        models_cur = legacy_conn.execute("SELECT * FROM models")
        models = models_cur.fetchall()
        report["total"] = len(models)
        
        db = DatabaseManager()
        
        for row in models:
            model_id = row["id"]
            hash_hex = row["hash_hex"]
            
            # Fetch tags for this model
            mt_cur = legacy_conn.execute("SELECT tag_id FROM model_tags WHERE model_id = ?", (model_id,))
            tag_ids = [r["tag_id"] for r in mt_cur.fetchall()]
            tag_names = [legacy_tag_map[tid]["name"] for tid in tag_ids if tid in legacy_tag_map]
            
            # Prepare common data
            model_data = {
                "path": row["path"],
                "name": row["name"],
                "type": row["type"],
                # "base": row["base"], # legacy might not have base, use type or NULL
                "size_bytes": row["size_bytes"],
                "created_at": row["created_at"],
                "meta_json": row["meta_json"]
            }
            
            if hash_hex and len(hash_hex) == 64: # Basic SHA256 validation
                # Valid hash: Import directly
                model_data["sha256"] = hash_hex
                db.upsert_model(model_data)
                
                # Import tags
                for tid in tag_ids:
                    if tid in legacy_tag_map:
                        tdata = legacy_tag_map[tid]
                        # Ensure tag exists
                        tag_row = db.get_tag(tdata["name"])
                        if not tag_row:
                            tag_row = db.create_tag(tdata["name"], tdata["color"])
                        
                        # Link
                        db.tag_model(hash_hex, tag_row["id"])
                
                report["migrated"] += 1
            else:
                # No hash: Pending Import
                pending_data = {
                    "path": row["path"],
                    "name": row["name"],
                    "type": row["type"],
                    "created_at": row["created_at"],
                    "legacy_tags_json": json.dumps(tag_names)
                }
                db.add_pending_import(pending_data)
                report["pending"] += 1
                
    except Exception as e:
        logger.error(f"Migration error: {e}")
        report["errors"] += 1
    finally:
        if 'legacy_conn' in locals():
            legacy_conn.close()
            
    return report
