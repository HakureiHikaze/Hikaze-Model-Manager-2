import sqlite3
import pytest
import json
import time
from unittest.mock import patch, MagicMock
from backend.database import DatabaseManager

def setup_pending_data(db):
    data = {
        "path": "/fake/model.ckpt",
        "name": "Pending Model",
        "type": "CHECKPOINT",
        "created_at": 12345,
        "legacy_tags_json": json.dumps(["tagA", "tagB"])
    }
    db.add_pending_import(data)

def test_migration_worker_processing(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    
    # Create dummy file
    model_path = tmp_path / "model.ckpt"
    model_path.write_bytes(b"dummy content")
    
    with patch("backend.util.config.DB_PATH", str(db_file)):
        from backend.database.migration.worker import MigrationWorker
        
        db = DatabaseManager()
        db.init_db()
        
        # Add pending import manually with real path
        data = {
            "path": str(model_path),
            "name": "Pending Model",
            "type": "CHECKPOINT",
            "created_at": 12345,
            "legacy_tags_json": json.dumps(["tagA", "tagB"])
        }
        db.add_pending_import(data)
        
        worker = MigrationWorker()
        worker.start()
        
        # Wait for worker to finish (it should finish quickly since only 1 item)
        # We need a way to know it's done or wait loop
        timeout = 2
        start_time = time.time()
        while time.time() - start_time < timeout:
            if not worker.is_alive():
                break
            if len(db.get_pending_imports()) == 0:
                 # It might be sleeping or finishing
                 worker.stop()
                 worker.join()
                 break
            time.sleep(0.1)
            
        assert len(db.get_pending_imports()) == 0
        
        # Verify model moved to main table
        # We need to know the hash. Since we control the file content, we can calc it or check DB
        conn = db.get_connection()
        cur = conn.execute("SELECT * FROM models")
        models = cur.fetchall()
        assert len(models) == 1
        assert models[0]["path"] == str(model_path)
        sha256 = models[0]["sha256"]
        
        # Verify tags
        tags = db.get_tags_for_model(sha256)
        tag_names = [t["name"] for t in tags]
        assert "tagA" in tag_names
        assert "tagB" in tag_names

def test_migration_worker_pause(tmp_path):
    # This is tricky to test without mocking the hash function to hang/pause
    # or using a lot of data.
    # We can mock the `calculate_sha256` function on the worker class or module.
    pass
