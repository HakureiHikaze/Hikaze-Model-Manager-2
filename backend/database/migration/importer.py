import json
import logging
import os
import shutil
from typing import Dict, Optional
from backend.database.db import DatabaseManager
from backend.util.image_processor import ImageProcessor
from backend.util import config
from shared.types.data_adapters import DataAdapters

logger = logging.getLogger(__name__)

def migrate_legacy_images(legacy_images_dir: str) -> Dict[str, int]:
    """
    Stage 1: Migrate images.
    - Active Models -> Compress to 3-tier -> data/images/
    - Pending Models -> Copy original -> data/images/pending/
    """
    report = {"images_processed": 0, "errors": 0}
    
    if not os.path.exists(legacy_images_dir):
        logger.error(f"Legacy images dir not found: {legacy_images_dir}")
        return report

    db = DatabaseManager()
    
    def find_legacy_image(filename: str) -> Optional[str]:
        path = os.path.join(legacy_images_dir, filename)
        if os.path.exists(path):
            return path
        return None

    # 1. Active Models
    try:
        # Fetch all model records
        rows = db.execute_query("SELECT sha256, meta_json FROM models")
        for row in rows:
            try:
                m_dict = dict(row)
                if isinstance(m_dict.get("meta_json"), str):
                    m_dict["meta_json"] = json.loads(m_dict["meta_json"])
                
                record = DataAdapters.dict_to_model_record(m_dict)
                # In legacy, 'images' was a list in meta_json. 
                # Our dict_to_model_record might have dropped it into prompts or ignored it.
                # Actually, dict_to_model_record uses MetaJson which doesn't have images.
                # We need the RAW meta_json for this migration step or the adapter needs to keep it.
                
                # Let's use the raw dict from row for image migration
                raw_meta = m_dict.get("meta_json") or {}
                images = raw_meta.get("images", [])
                if not images: continue
                
                filename = os.path.basename(str(images[0]))
                src_path = find_legacy_image(filename)
                
                if src_path:
                    with open(src_path, "rb") as f:
                        img_data = f.read()
                    ImageProcessor.save_legacy_active_image(img_data, record.sha256)
                    report["images_processed"] += 1
            except Exception:
                continue
    except Exception as e:
        logger.error(f"Error migrating active images: {e}")
        report["errors"] += 1

    # 2. Pending Models
    try:
        rows = db.execute_query("SELECT id, meta_json FROM pending_import")
        for row in rows:
            try:
                m_dict = dict(row)
                if isinstance(m_dict.get("meta_json"), str):
                    m_dict["meta_json"] = json.loads(m_dict["meta_json"])
                
                raw_meta = m_dict.get("meta_json") or {}
                images = raw_meta.get("images", [])
                if not images: continue
                
                filename = os.path.basename(str(images[0]))
                src_path = find_legacy_image(filename)
                
                if src_path:
                    dest_path = os.path.join(config.PENDING_IMAGES_DIR, filename)
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    shutil.copy2(src_path, dest_path)
                    report["images_processed"] += 1
            except Exception:
                continue
    except Exception as e:
        logger.error(f"Error migrating pending images: {e}")
        report["errors"] += 1

    return report

def strip_meta_images():
    """Remove image-related keys from meta_json in the models table to finalize migration."""
    db = DatabaseManager()
    
    rows = db.execute_query("SELECT sha256, meta_json FROM models")
    for row in rows:
        try:
            m_dict = dict(row)
            if not m_dict.get("meta_json"): continue
            
            meta = json.loads(m_dict["meta_json"]) if isinstance(m_dict["meta_json"], str) else m_dict["meta_json"]
            modified = False
            for key in ["image", "images", "preview"]:
                if key in meta:
                    meta.pop(key)
                    modified = True
            
            if modified:
                db.execute_non_query(
                    "UPDATE models SET meta_json = ? WHERE sha256 = ?",
                    (json.dumps(meta), m_dict["sha256"])
                )
        except Exception:
            continue