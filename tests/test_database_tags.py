import sqlite3
import pytest
from unittest.mock import patch

def test_tag_crud(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    with patch("backend.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        db = DatabaseManager()
        db.init_db()

        # 1. Create Tag
        tag = db.create_tag("anime", "#ff00ff")
        assert tag is not None
        assert tag["name"] == "anime"
        assert tag["color"] == "#ff00ff"

        # 2. Get Tag
        fetched = db.get_tag("anime")
        assert fetched["id"] == tag["id"]

        # 3. Tag Model
        # First create a model
        db.upsert_model({"sha256": "hash1", "path": "p1"})
        
        db.tag_model("hash1", tag["id"])
        
        # Verify (need get_tags_for_model)
        tags = db.get_tags_for_model("hash1")
        assert len(tags) == 1
        assert tags[0]["name"] == "anime"

        # 4. Untag
        db.untag_model("hash1", tag["id"])
        tags = db.get_tags_for_model("hash1")
        assert len(tags) == 0

def test_create_duplicate_tag(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    with patch("backend.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        db = DatabaseManager()
        db.init_db()

        t1 = db.create_tag("duplicate")
        # Should return existing or raise?
        # Typically get_or_create behavior is desired, but spec says "create_tag".
        # If it raises IntegrityError, we should handle it or test for it.
        # Let's assume we want it to raise or return None if specific create method.
        # But for user convenience, usually we just return the existing one or fail.
        # Let's verify behavior: if it fails, that's fine for "create".
        
        with pytest.raises(sqlite3.IntegrityError):
            db.create_tag("duplicate")
