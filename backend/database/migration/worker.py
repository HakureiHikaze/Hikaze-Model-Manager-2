import threading
import time
import hashlib
import logging
import os
from backend.database import DatabaseManager
from backend.util.image_processor import ImageProcessor

logger = logging.getLogger(__name__)

class MigrationWorker(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True)
        self._stop_event = threading.Event()
        self.db = DatabaseManager()
        
    def stop(self):
        """Signal the worker to stop."""
        self._stop_event.set()
        
    def run(self):
        """Main loop."""
        logger.info("MigrationWorker started.")
        while not self._stop_event.is_set():
            try:
                # Fetch next pending item
                # We fetch one by one to ensure we are always up to date
                pending_list = self.db.get_pending_imports()
                
                if not pending_list:
                    # Nothing to do, sleep a bit
                    time.sleep(1.0)
                    continue
                
                item = pending_list[0]
                self._process_item(item)
                
            except Exception as e:
                logger.error(f"Error in MigrationWorker loop: {e}")
                time.sleep(5.0) # Backoff on error
                
        logger.info("MigrationWorker stopped.")

    def _process_item(self, item):
        path = item["path"]
        legacy_id = item["id"]
        
        if self._stop_event.is_set():
            return

        if not os.path.exists(path):
            logger.warning(f"File not found during migration: {path}. Skipping/Removing.")
            self.db.remove_pending_import(path)
            # Cleanup pending image if it exists
            ImageProcessor.delete_images(str(legacy_id), is_pending=True)
            return

        def get_str(value):
            return value if value is not None else ""

        def get_int(value):
            if value is None:
                return 0
            try:
                return int(value)
            except (TypeError, ValueError):
                return 0

        # Calculate SHA256
        sha256 = self._calculate_sha256(path)
        if not sha256:
            return # stopped during hash or error

        meta_json = item["meta_json"]
        if meta_json is None:
            meta_json = "{}"

        # Move to models
        model_data = {
            "sha256": sha256,
            "path": path,
            "name": get_str(item["name"]),
            "type": get_str(item["type"]),
            "size_bytes": get_int(item["size_bytes"]),
            "created_at": get_int(item["created_at"]),
            "meta_json": meta_json
        }
        
        try:
            # 1. Create Active Record
            self.db.upsert_model(model_data)
            
            # 2. Restore Tags
            if legacy_id is not None:
                tag_ids = self.db.get_pending_tag_ids(legacy_id)
                for tag_id in tag_ids:
                    self.db.tag_model(sha256, tag_id)
            
            # 3. Reactive Migration of Image
            # Check if pending image exists (named after legacy_id)
            # If so, process/move it to active image (named after sha256)
            self._migrate_image(str(legacy_id), sha256)
            
            # 4. Remove from pending
            self.db.remove_pending_import(path)
            logger.info(f"Migrated {path} -> {sha256}")
            
        except Exception as e:
            logger.error(f"Failed to migrate item {path}: {e}")
            # Currently it will retry forever.

    def _migrate_image(self, legacy_id_str: str, sha256: str):
        """
        Move pending image to active image if it exists.
        """
        # We use ImageProcessor to handle the quality-tier logic
        # For a true migration, we should ideally re-process the high-res source if available,
        # but here we just rename the files for efficiency if they already match the tiers.
        # Actually, ImageProcessor.process_and_save is better if we have the bytes.
        
        # Check high-res pending image
        pending_path = ImageProcessor.get_image_path(legacy_id_str, quality="high", is_pending=True)
        if os.path.exists(pending_path):
            try:
                with open(pending_path, "rb") as f:
                    img_data = f.read()
                ImageProcessor.process_and_save(img_data, sha256, is_pending=False)
                ImageProcessor.delete_images(legacy_id_str, is_pending=True)
                logger.info(f"Migrated image for {sha256}")
            except Exception as e:
                logger.warning(f"Failed to migrate image for {sha256}: {e}")

    def _calculate_sha256(self, path: str) -> str:
        sha256_hash = hashlib.sha256()
        try:
            with open(path, "rb") as f:
                # Read in chunks to check for stop event
                for byte_block in iter(lambda: f.read(65536), b""):
                    if self._stop_event.is_set():
                        return None
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except IOError:
            return None