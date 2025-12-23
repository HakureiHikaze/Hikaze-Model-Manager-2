import sqlite3
import threading
import time
from typing import Optional, Dict, List, Any
from . import config

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS models (
    sha256 TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    name TEXT,
    type TEXT,
    base TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    last_used_at INTEGER,
    meta_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_models_path ON models(path);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT,
    created_at INTEGER
);

CREATE TABLE IF NOT EXISTS model_tags (
    model_hash TEXT,
    tag_id INTEGER,
    PRIMARY KEY (model_hash, tag_id),
    FOREIGN KEY(model_hash) REFERENCES models(sha256) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_import (
    path TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    created_at INTEGER,
    legacy_tags_json TEXT
);
"""

class DatabaseManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(DatabaseManager, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.db_path = config.DB_PATH
        self.local = threading.local()

    def get_connection(self) -> sqlite3.Connection:
        if not hasattr(self.local, "conn"):
             self.local.conn = sqlite3.connect(self.db_path)
             self.local.conn.row_factory = sqlite3.Row
             self.local.conn.execute("PRAGMA foreign_keys = ON")
        return self.local.conn

    def init_db(self):
        """Initialize the database schema."""
        conn = self.get_connection()
        with conn:
            conn.executescript(SCHEMA_SQL)

    def upsert_model(self, data: Dict[str, Any]):
        """Insert or update a model."""
        conn = self.get_connection()
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        # Update all fields except sha256 on conflict
        updates = ", ".join([f"{k}=excluded.{k}" for k in data.keys() if k != "sha256"])
        
        sql = f"""
        INSERT INTO models ({columns}) VALUES ({placeholders})
        ON CONFLICT(sha256) DO UPDATE SET {updates}
        """
        with conn:
            conn.execute(sql, list(data.values()))

    def get_model(self, sha256: str) -> Optional[sqlite3.Row]:
        """Retrieve a model by SHA256."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM models WHERE sha256 = ?", (sha256,))
        return cur.fetchone()

    def get_model_by_path(self, path: str) -> Optional[sqlite3.Row]:
        """Retrieve a model by file path."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM models WHERE path = ?", (path,))
        return cur.fetchone()

    def add_pending_import(self, data: Dict[str, Any]):
        """Add a model to the pending import staging table."""
        conn = self.get_connection()
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        # Replace if path exists
        sql = f"INSERT OR REPLACE INTO pending_import ({columns}) VALUES ({placeholders})"
        with conn:
            conn.execute(sql, list(data.values()))

    def get_pending_imports(self) -> List[sqlite3.Row]:
        """Get all pending imports sorted by creation time."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM pending_import ORDER BY created_at")
        return cur.fetchall()

    def remove_pending_import(self, path: str):
        """Remove a model from the pending import staging table."""
        conn = self.get_connection()
        with conn:
            conn.execute("DELETE FROM pending_import WHERE path = ?", (path,))

    def create_tag(self, name: str, color: Optional[str] = None) -> sqlite3.Row:
        """Create a new tag."""
        conn = self.get_connection()
        created_at = int(time.time() * 1000)
        with conn:
            cur = conn.execute(
                "INSERT INTO tags (name, color, created_at) VALUES (?, ?, ?)",
                (name, color, created_at)
            )
            tag_id = cur.lastrowid
        return self.get_tag_by_id(tag_id)

    def get_tag(self, name: str) -> Optional[sqlite3.Row]:
        """Retrieve a tag by name."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM tags WHERE name = ?", (name,))
        return cur.fetchone()
    
    def get_tag_by_id(self, tag_id: int) -> Optional[sqlite3.Row]:
        """Retrieve a tag by ID."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM tags WHERE id = ?", (tag_id,))
        return cur.fetchone()

    def tag_model(self, model_hash: str, tag_id: int):
        """Associate a tag with a model."""
        conn = self.get_connection()
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO model_tags (model_hash, tag_id) VALUES (?, ?)",
                (model_hash, tag_id)
            )

    def untag_model(self, model_hash: str, tag_id: int):
        """Remove a tag association from a model."""
        conn = self.get_connection()
        with conn:
            conn.execute(
                "DELETE FROM model_tags WHERE model_hash = ? AND tag_id = ?",
                (model_hash, tag_id)
            )

    def get_tags_for_model(self, model_hash: str) -> List[sqlite3.Row]:
        """Get all tags associated with a model."""
        conn = self.get_connection()
        cur = conn.execute("""
            SELECT t.* FROM tags t
            JOIN model_tags mt ON t.id = mt.tag_id
            WHERE mt.model_hash = ?
        """, (model_hash,))
        return cur.fetchall()
