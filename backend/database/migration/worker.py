import threading
import time
import hashlib
import json
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
        
        if self._stop_event.is_set():
            return

        if not os.path.exists(path):
            logger.warning(f"File not found during migration: {path}. Skipping/Removing.")
            self.db.remove_pending_import(path)
            return

        # Calculate SHA256
        sha256 = self._calculate_sha256(path)
        if not sha256:
            return # stopped during hash

        # Move to models
        model_data = {
            "sha256": sha256,
            "path": path,
            "name": item["name"],
            "type": item["type"],
            "created_at": item["created_at"],
            "meta_json": "{}" # or migrate legacy meta if needed
        }
        
        try:
            self.db.upsert_model(model_data)
            
            # Restore Tags
            legacy_tags_json = item["legacy_tags_json"]
            if legacy_tags_json:
                tag_names = json.loads(legacy_tags_json)
                for name in tag_names:
                    # We might need to ensure tag exists (though importer should have created them)
                    # If importer created them based on legacy IDs, names are there.
                    # But duplicate names logic is unique constraint. 
                    # DatabaseManager.create_tag returns existing if we implemented it that way?
                    # Spec said create_tag creates. Importer logic checked get_tag first.
                    # Let's check get_tag first here too.
                    tag_row = self.db.get_tag(name)
                    if not tag_row:
                        # Fallback: create it if missing (e.g. race condition or manual pending insert)
                        tag_row = self.db.create_tag(name)
                    
                    self.db.tag_model(sha256, tag_row["id"])
            
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
