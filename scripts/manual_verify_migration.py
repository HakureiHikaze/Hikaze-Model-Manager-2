import sys
import os
import sqlite3
import json

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.migration.importer import migrate_legacy_db
from backend.database.db import DatabaseManager
from backend.util import config

def create_mock_legacy_db(path):
    if os.path.exists(path):
        os.remove(path)
        
    conn = sqlite3.connect(path)
    # Legacy Schema (Simplified for test)
    conn.executescript("""
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
    """)
    
    # Insert Data
    # 1. Hashed Model
    conn.execute("INSERT INTO models (id, path, name, hash_hex) VALUES (1, 'legacy/path/1.safetensors', 'model1', 'aabbccddeeff11223344556677889900aabbccddeeff11223344556677889900')")
    # 2. Unhashed Model
    conn.execute("INSERT INTO models (id, path, name, hash_hex) VALUES (2, 'legacy/path/2.safetensors', 'model2', NULL)")
    
    # Tags
    conn.execute("INSERT INTO tags (id, name) VALUES (10, 'legacy_tag')")
    
    # Relations
    conn.execute("INSERT INTO model_tags (model_id, tag_id) VALUES (1, 10)")
    conn.execute("INSERT INTO model_tags (model_id, tag_id) VALUES (2, 10)")
    
    conn.commit()
    conn.close()
    print(f"    Created mock legacy DB at {path}")

def verify_migration():
    print(">>> Verifying Legacy Migration...")
    
    mock_db_path = os.path.join(os.path.dirname(__file__), "mock_legacy.db")
    create_mock_legacy_db(mock_db_path)
    
    # Run Migration
    print("\n[1] Running migrate_legacy_db...")
    try:
        report = migrate_legacy_db(mock_db_path)
        print(f"    Report: {report}")
        
        if report["migrated"] == 1 and report["pending"] == 1:
            print("    SUCCESS: Report counts match.")
        else:
            print("    FAILURE: Report counts mismatch.")
    except Exception as e:
        print(f"    FAILURE: {e}")
        return

    # Verify Data in Main DB
    print("\n[2] Verifying Data in Main DB...")
    db = DatabaseManager()
    
    # Check Hashed Model
    model = db.get_model("aabbccddeeff11223344556677889900aabbccddeeff11223344556677889900")
    if model and model["name"] == "model1":
        print("    SUCCESS: Hashed model migrated.")
    else:
        print("    FAILURE: Hashed model missing.")

    # Check Pending Model
    # Note: pending_import uses auto-inc ID in new schema if not forced? 
    # Actually, importer preserves ID.
    # But wait, `pending_import` table definition: `id INTEGER PRIMARY KEY`.
    # `add_pending_import` helper:
    # sql = f"INSERT INTO pending_import ({columns}) VALUES ({placeholders})"
    # The importer sets "id" in data. So it should be preserved.
    
    # We can query directly.
    conn = db.get_connection()
    pending = conn.execute("SELECT * FROM pending_import WHERE id = 2").fetchone()
    if pending and pending["name"] == "model2":
        print("    SUCCESS: Pending model migrated.")
    else:
        print("    FAILURE: Pending model missing.")

    # Clean up
    if os.path.exists(mock_db_path):
        os.remove(mock_db_path)
    
    print("\n>>> Migration Verification Complete.")

if __name__ == "__main__":
    verify_migration()
