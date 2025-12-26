import threading
import logging
from typing import Dict, Optional
from .importer import migrate_legacy_db
from .worker import MigrationWorker

logger = logging.getLogger(__name__)

class MigrationManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(MigrationManager, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.worker: Optional[MigrationWorker] = None

    def start_full_migration(self, legacy_db_path: str) -> Dict[str, int]:
        """
        Run synchronous import stage, then start async worker.
        """
        logger.info(f"Starting full migration from {legacy_db_path}")
        
        # Stage 1: Import
        report = migrate_legacy_db(legacy_db_path)
        logger.info(f"Import Report: {report}")
        
        # Stage 2: Start Worker if there are pending items
        if report["pending"] > 0:
            self.resume_processing()
            
        return report

    def resume_processing(self):
        """Start or Resume the worker thread."""
        with self._lock:
            if self.worker and self.worker.is_alive():
                logger.info("Worker already running.")
                return

            self.worker = MigrationWorker()
            self.worker.start()
            logger.info("Migration worker started.")

    def pause_processing(self):
        """Stop the worker thread."""
        with self._lock:
            if self.worker:
                self.worker.stop()
                self.worker.join() # Wait for it to stop
                self.worker = None
                logger.info("Migration worker paused.")

    def is_processing(self) -> bool:
        """Check if worker is running."""
        return self.worker is not None and self.worker.is_alive()