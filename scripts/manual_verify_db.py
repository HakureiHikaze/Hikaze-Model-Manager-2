import sys
import os
import sqlite3

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.db import DatabaseManager
from backend.util import config

def verify_database_manager():
    print(">>> Verifying DatabaseManager...")
    
    # 1. Initialize
    print("\n[1] Initializing DatabaseManager...")
    try:
        db = DatabaseManager()
        db.init_db()
        print("    SUCCESS: Database initialized.")
    except Exception as e:
        print(f"    FAILURE: {e}")
        return

    # 2. Test Connection
    print("\n[2] Testing Connection...")
    try:
        conn = db.get_connection()
        cursor = conn.execute("SELECT 1")
        result = cursor.fetchone()
        if result and result[0] == 1:
            print("    SUCCESS: Connection valid.")
        else:
            print("    FAILURE: Unexpected result.")
    except Exception as e:
        print(f"    FAILURE: {e}")

    # 3. CRUD: Tags
    print("\n[3] Testing Tags CRUD...")
    try:
        tag = db.create_tag("test_tag")
        print(f"    Created tag: {dict(tag)}")
        
        fetched_tag = db.get_tag("test_tag")
        if fetched_tag and fetched_tag["name"] == "test_tag":
            print("    SUCCESS: Tag created and fetched.")
        else:
            print("    FAILURE: Tag fetch mismatch.")
    except Exception as e:
        print(f"    FAILURE: {e}")

    # 4. CRUD: Pending Import
    print("\n[4] Testing Pending Import CRUD...")
    try:
        pending_data = {
            "path": "test/path/model.safetensors",
            "sha256": None,
            "name": "test_model",
            "type": "checkpoint",
            "size_bytes": 1024,
            "created_at": 123456,
            "meta_json": "{}"
        }
        # Insert with ID (simulating migration or new logic)
        # Note: add_pending_import schema might rely on auto-increment ID if not provided, 
        # but the schema definition has `id INTEGER PRIMARY KEY`.
        # Let's check `add_pending_import` implementation in `db.py`.
        # It takes `data` dict and inserts it. If ID is missing, sqlite handles it?
        # `pending_import` has `id INTEGER PRIMARY KEY`.
        
        db.add_pending_import(pending_data)
        print("    Added pending import.")
        
        imports = db.get_pending_imports()
        found = any(i["path"] == "test/path/model.safetensors" for i in imports)
        if found:
            print("    SUCCESS: Pending import found.")
        else:
            print("    FAILURE: Pending import not found.")
            
        # Clean up
        db.remove_pending_import("test/path/model.safetensors")
        print("    Removed pending import.")
    except Exception as e:
        print(f"    FAILURE: {e}")

    print("\n>>> DatabaseManager Verification Complete.")

if __name__ == "__main__":
    # Ensure config points to a test DB if possible, or just use default (dev)
    print(f"Using DB Path: {config.DB_PATH}")
    verify_database_manager()
