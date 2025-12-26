import hashlib
import logging
import os
from backend.database import DatabaseManager
from backend.util.image_processor import ImageProcessor

logger = logging.getLogger(__name__)

def process_pending_item(item: dict):
    """
    Reactive migration logic for a single pending item.
    1. Calculate SHA256.
    2. Move to models.
    3. Migrate image (legacy_id -> sha256_seq).
    4. Remove from pending.
    """
    path = item["path"]
    legacy_id = item["id"]
    db = DatabaseManager()

    if not os.path.exists(path):
        logger.warning(f"File not found during migration: {path}. Skipping/Removing.")
        db.remove_pending_import(path)
        ImageProcessor.delete_images(str(legacy_id), is_pending=True)
        return

    # Calculate SHA256
    sha256 = calculate_sha256(path)
    if not sha256:
        logger.error(f"Failed to calculate hash for {path}")
        return

    meta_json = item["meta_json"] or "{}"

    # Move to models
    model_data = {
        "sha256": sha256,
        "path": path,
        "name": item["name"] or "",
        "type": item["type"] or "",
        "size_bytes": item["size_bytes"] or 0,
        "created_at": item["created_at"] or 0,
        "meta_json": meta_json
    }
    
    try:
        # 1. Create Active Record
        db.upsert_model(model_data)
        
        # 2. Restore Tags
        if legacy_id is not None:
            tag_ids = db.get_pending_tag_ids(legacy_id)
            for tag_id in tag_ids:
                db.tag_model(sha256, tag_id)
        
        # 3. Reactive Migration of Image
        migrate_pending_image(str(legacy_id), sha256)
        
        # 4. Remove from pending
        db.remove_pending_import(path)
        logger.info(f"Migrated {path} -> {sha256}")
        
        return sha256
        
    except Exception as e:
        logger.error(f"Failed to migrate item {path}: {e}")
        raise

def migrate_pending_image(legacy_id_str: str, sha256: str):
    """
    Move pending image to active image if it exists.
    Naming: <sha256>_<seq>_<quality>.webp
    """
    # Check pending image (we try 'high' quality or exact ID match if we saved original)
    # Refactor Stage 1 says we save "Original" as `legacy_id.ext`.
    # So we search for files starting with `legacy_id.` in pending dir.
    
    from backend.util import config
    import glob
    
    # Pattern: legacy_id.*
    pattern = os.path.join(config.PENDING_IMAGES_DIR, f"{legacy_id_str}.*")
    files = glob.glob(pattern)
    
    if not files:
        # Fallback to old behavior (check for _high.webp)
        pending_path = ImageProcessor.get_image_path(legacy_id_str, quality="high", is_pending=True)
        if os.path.exists(pending_path):
            files = [pending_path]
            
    if files:
        src_path = files[0] # Take first match
        try:
            with open(src_path, "rb") as f:
                img_data = f.read()
            
            # Use save_legacy_active_image to handle naming/conflict
            ImageProcessor.save_legacy_active_image(img_data, sha256)
            
            # Cleanup pending
            for f in files:
                try: os.remove(f)
                except: pass
            # Also cleanup via helper
            ImageProcessor.delete_images(legacy_id_str, is_pending=True)
            
            logger.info(f"Migrated image for {sha256}")
        except Exception as e:
            logger.warning(f"Failed to migrate image for {sha256}: {e}")

def calculate_sha256(path: str) -> str:
    sha256_hash = hashlib.sha256()
    try:
        with open(path, "rb") as f:
            for byte_block in iter(lambda: f.read(65536), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except IOError:
        return None
