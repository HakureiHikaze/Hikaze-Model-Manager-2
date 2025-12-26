import sqlite3
import threading
import time
from typing import Optional, Dict, List, Any
from backend.util import config

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS models (
    sha256 TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    name TEXT,
    type TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    meta_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_models_path ON models(path);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS model_tags (
    model_hash TEXT,
    tag_id INTEGER,
    PRIMARY KEY (model_hash, tag_id),
    FOREIGN KEY(model_hash) REFERENCES models(sha256) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_model_tags (
    model_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (model_id, tag_id),
    FOREIGN KEY(model_id) REFERENCES pending_import(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_import (
    id INTEGER PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    sha256 TEXT,
    name TEXT,
    type TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    meta_json TEXT
);

CREATE TABLE IF NOT EXISTS db_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);
"""

class _DatabaseHandle:
    """Thread-local database connection wrapper."""

    def __init__(self, db_path: str):
        self.db_path = db_path
        self.local = threading.local()

    def get_connection(self) -> sqlite3.Connection:
        if not self.db_path:
            raise ValueError("Database path is not configured.")
        if not hasattr(self.local, "conn"):
            self.local.conn = sqlite3.connect(self.db_path)
            self.local.conn.row_factory = sqlite3.Row
            self.local.conn.execute("PRAGMA foreign_keys = ON")
        return self.local.conn

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
        self.primary = _DatabaseHandle(config.DB_PATH)
        self.legacy = _DatabaseHandle(config.LEGACY_DB_PATH)
        self.db_path = self.primary.db_path
        self.local = self.primary.local
        self.debug_mode = config.DB_DEBUG_MODE

    def get_connection(self) -> sqlite3.Connection:
        return self.primary.get_connection()

    def get_legacy_connection(self) -> sqlite3.Connection:
        """Retrieve a legacy database connection."""
        return self.legacy.get_connection()

    def init_db(self):
        """Initialize the database schema."""
        conn = self.get_connection()
        with conn:
            conn.executescript(SCHEMA_SQL)
            
            # Initialize db_version if not present
            cur = conn.execute("SELECT 1 FROM db_meta WHERE key = 'db_version'")
            if not cur.fetchone():
                conn.execute(
                    "INSERT INTO db_meta (key, value) VALUES ('db_version', '2')"
                )
            
            # Initialize tags_id_max if not present
            cur = conn.execute("SELECT 1 FROM db_meta WHERE key = 'tags_id_max'")
            if not cur.fetchone():
                # Get current max tag id
                cur_tags = conn.execute("SELECT MAX(id) as max_id FROM tags")
                max_id = cur_tags.fetchone()["max_id"] or 0
                conn.execute(
                    "INSERT INTO db_meta (key, value) VALUES ('tags_id_max', ?)",
                    (str(max_id),)
                )

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
            cur = conn.execute(
                "SELECT id FROM pending_import WHERE path = ?",
                (path,)
            )
            row = cur.fetchone()
            if row and row["id"] is not None:
                conn.execute(
                    "DELETE FROM pending_model_tags WHERE model_id = ?",
                    (row["id"],)
                )
            conn.execute("DELETE FROM pending_import WHERE path = ?", (path,))

    def create_tag(self, name: str) -> sqlite3.Row:
        """Create a new tag."""
        conn = self.get_connection()
        with conn:
            cur = conn.execute(
                "INSERT INTO tags (name) VALUES (?)",
                (name,)
            )
            tag_id = cur.lastrowid
            
            # Update tags_id_max
            conn.execute(
                "UPDATE db_meta SET value = ? WHERE key = 'tags_id_max' AND CAST(value AS INTEGER) < ?",
                (str(tag_id), tag_id)
            )
            
        return self.get_tag_by_id(tag_id)

    def upsert_tag_with_id(
        self,
        tag_id: int,
        name: str
    ) -> sqlite3.Row:
        """Insert or update a tag with an explicit ID."""
        conn = self.get_connection()
        safe_name = name or ""
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO tags (id, name) "
                "VALUES (?, ?)",
                (tag_id, safe_name)
            )
            
            # Update tags_id_max
            conn.execute(
                "UPDATE db_meta SET value = ? WHERE key = 'tags_id_max' AND CAST(value AS INTEGER) < ?",
                (str(tag_id), tag_id)
            )
            
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

    def add_pending_model_tag(self, model_id: int, tag_id: int):
        """Associate a legacy tag with a pending legacy model id."""
        conn = self.get_connection()
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO pending_model_tags (model_id, tag_id) "
                "VALUES (?, ?)",
                (model_id, tag_id)
            )

    def get_pending_tag_ids(self, model_id: int) -> List[int]:
        """Get legacy tag IDs associated with a pending legacy model id."""
        conn = self.get_connection()
        cur = conn.execute(
            "SELECT tag_id FROM pending_model_tags WHERE model_id = ?",
            (model_id,)
        )
        return [row["tag_id"] for row in cur.fetchall()]

    def remove_pending_model_tags(self, model_id: int):
        """Remove pending tag mappings for a legacy model id."""
        conn = self.get_connection()
        with conn:
            conn.execute(
                "DELETE FROM pending_model_tags WHERE model_id = ?",
                (model_id,)
            )

    def get_meta(self, key: str, default: Any = None) -> Any:
        """Retrieve a metadata value."""
        conn = self.get_connection()
        cur = conn.execute("SELECT value FROM db_meta WHERE key = ?", (key,))
        row = cur.fetchone()
        return row["value"] if row else default

    def set_meta(self, key: str, value: Any):
        """Set a metadata value."""
        conn = self.get_connection()
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO db_meta (key, value) VALUES (?, ?)",
                (key, str(value))
            )
