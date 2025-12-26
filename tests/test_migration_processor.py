import pytest
import os
import sqlite3
from unittest.mock import patch, MagicMock
from backend.database.migration.processor import process_pending_item, calculate_sha256

def test_calculate_sha256(tmp_path):
    f = tmp_path / "test.bin"
    f.write_bytes(b"test data")
    
    expected = "916f0027a575074ce72a331777c3478d6513f786a591bd892da1a577bf2335f9"
    
    assert calculate_sha256(str(f)) == expected

def test_process_pending_item_db(tmp_path):
    db_file = tmp_path / "test.db"
    with patch("backend.util.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        db = DatabaseManager()
        db.init_db()
        
        # Setup pending item
        item = {
            "path": str(tmp_path / "test.bin"),
            "id": 1,
            "name": "test",
            "type": "lora",
            "size_bytes": 9,
            "created_at": 100,
            "meta_json": "{}"
        }
        
        # Create file
        with open(item["path"], "wb") as f:
            f.write(b"test data")
            
        # Insert into pending
        db.add_pending_import(item)
        
        # Run processor
        with patch("backend.database.migration.processor.migrate_pending_image") as mock_img:
            sha256 = process_pending_item(item)
            
            assert sha256 == "916f0027a575074ce72a331777c3478d6513f786a591bd892da1a577bf2335f9"
            
            # Verify DB state
            # Should be in models
            model = db.get_model(sha256)
            assert model is not None
            assert model["path"] == item["path"]
            
            # Should NOT be in pending
            pending = db.get_pending_imports()
            assert len(pending) == 0