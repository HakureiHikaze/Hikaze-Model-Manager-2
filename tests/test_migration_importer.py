import sqlite3
import pytest
import json
from unittest.mock import patch, MagicMock

# Setup legacy DB schema for testing
LEGACY_SCHEMA = """
CREATE TABLE models (
  id INTEGER PRIMARY KEY,
  path TEXT,
  name TEXT,
  type TEXT,
  size_bytes INTEGER,
  hash_hex TEXT,
  created_at INTEGER,
  extra_json TEXT,
  meta_json TEXT
);
CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT,
  color TEXT
);
CREATE TABLE model_tags (
  model_id INTEGER,
  tag_id INTEGER
);
"""

def setup_legacy_db(path):
    conn = sqlite3.connect(path)
    conn.executescript(LEGACY_SCHEMA)
    
    # 1. Hashed Model (should go to models)
    valid_hash = "a" * 64
    conn.execute(f"INSERT INTO models (id, path, name, type, hash_hex, created_at, extra_json) VALUES (1, 'p1', 'm1', 'ckpt', '{valid_hash}', 100, '{{\"legacy\": true}}')")
    # Tags for m1
    conn.execute("INSERT INTO tags (id, name, color) VALUES (1, 't1', 'red')")
    conn.execute("INSERT INTO model_tags (model_id, tag_id) VALUES (1, 1)")

    # 2. Unhashed Model (should go to pending_import)
    conn.execute("INSERT INTO models (id, path, name, type, hash_hex, created_at) VALUES (2, 'p2', 'm2', 'lora', NULL, 200)")
    # Tags for m2
    conn.execute("INSERT INTO tags (id, name, color) VALUES (2, 't2', 'blue')")
    conn.execute("INSERT INTO model_tags (model_id, tag_id) VALUES (2, 2)")
    
    conn.commit()
    conn.close()

def test_import_legacy_data(tmp_path):
    legacy_db_path = tmp_path / "legacy.db"
    setup_legacy_db(str(legacy_db_path))
    
    new_db_path = tmp_path / "new.db"
    
    with patch("backend.util.config.DB_PATH", str(new_db_path)):
        from backend.database import DatabaseManager
        from backend.database.migration.importer import import_legacy_data
        
        # Init new DB
        db = DatabaseManager()
        db.init_db()
        
        # Run Import
        report = import_legacy_data(str(legacy_db_path))
        
        assert report["migrated"] == 1 # m1
        assert report["pending"] == 1 # m2
        
        # Verify m1 in models
        valid_hash = "a" * 64
        m1 = db.get_model(valid_hash)
        assert m1 is not None
        assert m1["path"] == "p1"
        assert json.loads(m1["meta_json"]) == {"legacy": True}
        
        # Verify tags for m1
        tags1 = db.get_tags_for_model(valid_hash)
        assert len(tags1) == 1
        assert tags1[0]["name"] == "t1"
        assert tags1[0]["id"] == 1 # Preserve ID
        
        # Verify m2 in pending_import
        pending = db.get_pending_imports()
        assert len(pending) == 1
        m2_pending = pending[0]
        assert m2_pending["path"] == "p2"
        assert m2_pending["id"] == 2 # Preserve ID
        
        # Verify pending tags for m2
        pending_tag_ids = db.get_pending_tag_ids(2)
        assert 2 in pending_tag_ids
        
        # Verify tags_id_max
        assert int(db.get_meta("tags_id_max")) == 2
