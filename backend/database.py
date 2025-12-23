import sqlite3
import threading
from .config import DB_PATH

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
        self.db_path = DB_PATH
        self.local = threading.local()

    def get_connection(self):
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
