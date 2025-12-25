import threading
import time
import hashlib
import logging
import os
from backend.database import DatabaseManager

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
                # In a real scenario, we might fetch a batch, but processing is slow (IO)
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
        model_id = item["model_id"]
        
        if self._stop_event.is_set():
            return

        if not os.path.exists(path):
            logger.warning(f"File not found during migration: {path}. Skipping/Removing.")
            self.db.remove_pending_import(path)
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
            return # stopped during hash

        meta_json = item["meta_json"]
        if meta_json is None:
            meta_json = "{}"

        # Move to models
        model_data = {
            "sha256": sha256,
            "path": path,
            "name": get_str(item["name"]),
            "type": get_str(item["type"]),
            "base": get_str(item["base"]),
            "size_bytes": get_int(item["size_bytes"]),
            "created_at": get_int(item["created_at"]),
            "last_used_at": get_int(item["last_used_at"]),
            "meta_json": meta_json
        }
        
        try:
            self.db.upsert_model(model_data)
            
            # Restore Tags
            if model_id is not None:
                tag_ids = self.db.get_pending_tag_ids(model_id)
                for tag_id in tag_ids:
                    self.db.tag_model(sha256, tag_id)
            
            # Remove from pending
            self.db.remove_pending_import(path)
            logger.info(f"Migrated {path} -> {sha256}")
            
        except Exception as e:
            logger.error(f"Failed to migrate item {path}: {e}")
            # Do we remove it or leave it to retry? 
            # If it's a persistent error, it will block the queue.
            # For now, let's leave it and maybe implement a retry count later.
            # To avoid infinite loop in this MVP, we might want to move it to a 'failed' table or just log.
            # Currently it will retry forever.

    def _calculate_sha256(self, path: str) -> str:
        sha256_hash = hashlib.sha256()
        try:
            with open(path, "rb") as f:
                # Read in chunks to check for stop event
                for byte_block in iter(lambda: f.read(4096), b""):
                    if self._stop_event.is_set():
                        return None
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except IOError:
            return None
