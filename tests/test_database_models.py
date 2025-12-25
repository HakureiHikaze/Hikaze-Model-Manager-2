import sqlite3
import pytest
from unittest.mock import patch

def test_model_crud(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    with patch("backend.util.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        db = DatabaseManager()
        db.init_db()

        # Data
        model_data = {
            "sha256": "hash123",
            "path": "/path/to/model.safetensors",
            "name": "Test Model",
            "type": "CHECKPOINT",
            "base": "SD1.5",
            "size_bytes": 1024,
            "created_at": 1000,
            "meta_json": "{}"
        }

        # 1. Upsert
        db.upsert_model(model_data)

        # 2. Get by Hash
        row = db.get_model("hash123")
        assert row is not None
        assert row["path"] == "/path/to/model.safetensors"
        assert row["name"] == "Test Model"

        # 3. Get by Path
        row = db.get_model_by_path("/path/to/model.safetensors")
        assert row is not None
        assert row["sha256"] == "hash123"

        # 4. Update
        model_data["name"] = "Updated Model"
        db.upsert_model(model_data)
        row = db.get_model("hash123")
        assert row["name"] == "Updated Model"

def test_pending_import_crud(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    with patch("backend.util.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        db = DatabaseManager()
        db.init_db()

        # Add pending (we need a method for this, let's assume upsert_pending_import)
        pending_data = {
            "path": "/path/to/legacy.ckpt",
            "name": "Legacy Model",
            "type": "CHECKPOINT",
            "created_at": 2000,
            "legacy_tags_json": '["tag1", "tag2"]'
        }
        
        # We need to implement add_pending_import
        db.add_pending_import(pending_data)

        # Get list
        pending = db.get_pending_imports()
        assert len(pending) == 1
        assert pending[0]["path"] == "/path/to/legacy.ckpt"
        assert pending[0]["legacy_tags_json"] == '["tag1", "tag2"]'

        # Remove
        db.remove_pending_import("/path/to/legacy.ckpt")
        pending = db.get_pending_imports()
        assert len(pending) == 0