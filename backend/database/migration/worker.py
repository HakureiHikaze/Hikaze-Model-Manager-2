import threading
import time
import logging
from backend.database import DatabaseManager
from .processor import process_pending_item

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
                pending_list = self.db.get_pending_imports()
                
                if not pending_list:
                    time.sleep(1.0)
                    continue
                
                item = pending_list[0]
                process_pending_item(item)
                
            except Exception as e:
                logger.error(f"Error in MigrationWorker loop: {e}")
                time.sleep(5.0) 
                
        logger.info("MigrationWorker stopped.")
