import sqlite3
import os
from unittest.mock import patch, MagicMock
import pytest

# Mock backend.config before importing backend.database if possible, or patch it during test
# Since we import backend.database inside test functions or use patch, it's fine.

def test_database_init_creates_tables(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    
    with patch("backend.util.config.DB_PATH", str(db_file)):
        from backend.database import DatabaseManager
        
        db = DatabaseManager()
        db.init_db()
        
        # Verify tables exist
        conn = sqlite3.connect(str(db_file))
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        assert "models" in tables
        assert "tags" in tables
        assert "model_tags" in tables
        assert "pending_import" in tables
        
        # Verify models schema
        cursor.execute("PRAGMA table_info(models)")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        assert "sha256" in columns
        assert columns["sha256"] == "TEXT" # PRIMARY KEY
        assert "path" in columns
        assert "meta_json" in columns
        
        # Verify pending_import schema
        cursor.execute("PRAGMA table_info(pending_import)")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        assert "path" in columns
        assert "id" in columns
        
        # Verify db_meta exists
        assert "db_meta" in tables
        
        conn.close()

def test_singleton_behavior():
    # If we decide to make it a singleton
    pass
