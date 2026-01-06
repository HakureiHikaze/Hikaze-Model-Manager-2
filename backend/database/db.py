import sqlite3
import threading
import json
import logging
from typing import Optional, Dict, List, Any
from backend.util import config
from shared.types.model_record import ModelRecord, PendingModelRecord, Tag
from shared.types.data_adapters import DataAdapters
from ..util.consts import SCHEMA_SQL

logger = logging.getLogger(__name__)

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
        if not self.db_path:
            raise ValueError("Database path is not configured.")
        self.local = threading.local()

    def get_connection(self, path: Optional[str] = None) -> sqlite3.Connection:
        """
        Get a connection to the database. 
        If path is provided, returns a connection to that specific DB (not cached in thread local).
        Otherwise returns the default cached connection.
        """
        if path:
            conn = sqlite3.connect(path)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON")
            return conn

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
            
            # Initialize db_meta defaults
            cur = conn.execute("SELECT 1 FROM db_meta WHERE key = 'db_version'")
            if not cur.fetchone():
                conn.execute("INSERT INTO db_meta (key, value) VALUES ('db_version', '2')")
            
            cur = conn.execute("SELECT 1 FROM db_meta WHERE key = 'tags_id_max'")
            if not cur.fetchone():
                cur_tags = conn.execute("SELECT MAX(id) as max_id FROM tags")
                max_id = cur_tags.fetchone()["max_id"] or 0
                conn.execute("INSERT INTO db_meta (key, value) VALUES ('tags_id_max', ?)", (str(max_id),))

    # --- Typed Retrieval Methods ---

    def get_model_by_sha256(self, sha256: str) -> Optional[ModelRecord]:
        """Retrieve a ModelRecord by SHA256."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM models WHERE sha256 = ?", (sha256,))
        row = cur.fetchone()
        if not row:
            return None
        
        m_dict = dict(row)
        # Handle JSON parsing for meta_json string in DB
        if isinstance(m_dict.get("meta_json"), str):
            try:
                m_dict["meta_json"] = json.loads(m_dict["meta_json"])
            except:
                m_dict["meta_json"] = {}
        
        record = DataAdapters.dict_to_model_record(m_dict)
        # Fetch tags
        tag_rows = self.get_tags_for_model(sha256)
        record.tags = [Tag(t["id"], t["name"]) for t in tag_rows]
        return record

    def get_pending_model_by_id(self, item_id: int) -> Optional[PendingModelRecord]:
        """Retrieve a PendingModelRecord by ID."""
        conn = self.get_connection()
        cur = conn.execute("SELECT * FROM pending_import WHERE id = ?", (item_id,))
        row = cur.fetchone()
        if not row:
            return None
            
        m_dict = dict(row)
        if isinstance(m_dict.get("meta_json"), str):
            try:
                m_dict["meta_json"] = json.loads(m_dict["meta_json"])
            except:
                m_dict["meta_json"] = {}

        return DataAdapters.dict_to_pending_model_record(m_dict)

    def get_tag_names(self, tag_ids: List[int]) -> Dict[int, str]:
        """Resolve a list of Tag IDs to their names."""
        if not tag_ids:
            return {}
        conn = self.get_connection()
        placeholders = ", ".join(["?"] * len(tag_ids))
        cur = conn.execute(f"SELECT id, name FROM tags WHERE id IN ({placeholders})", tag_ids)
        return {row["id"]: row["name"] for row in cur.fetchall()}

    # --- Generic Execution ---

    def execute_query(self, sql: str, params: tuple = ()) -> List[sqlite3.Row]:
        """Execute a custom parameterized query and return all results."""
        conn = self.get_connection()
        cur = conn.execute(sql, params)
        return cur.fetchall()

    def execute_non_query(self, sql: str, params: tuple = ()):
        """Execute a custom parameterized command (INSERT/UPDATE/DELETE)."""
        conn = self.get_connection()
        with conn:
            conn.execute(sql, params)

    # --- Core CRUD (Simplified) ---

    def upsert_model(self, record: ModelRecord):
        """Insert or update a model using a ModelRecord."""
        conn = self.get_connection()
        data = DataAdapters.to_dict(record)
        
        if "tags" in data:
            del data["tags"]

        # Serialize meta_json for DB
        data["meta_json"] = json.dumps(data["meta_json"])
        
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        updates = ", ".join([f"{k}=excluded.{k}" for k in data.keys() if k != "sha256"])
        
        sql = f"INSERT INTO models ({columns}) VALUES ({placeholders}) ON CONFLICT(sha256) DO UPDATE SET {updates}"
        with conn:
            conn.execute(sql, list(data.values()))

    def delete_model(self, sha256: str):
        """Remove a model by SHA256."""
        self.execute_non_query("DELETE FROM models WHERE sha256 = ?", (sha256,))

    def add_pending_import(self, record: PendingModelRecord) -> bool:
        """Add a model to the pending import table."""
        conn = self.get_connection()
        data = DataAdapters.to_dict(record)
        # Remove 'id' if it's 0 (let DB autoincrement if needed, though pending_import.id is PK)
        if data.get("id") == 0:
            del data["id"]
            
        if "tags" in data:
            del data["tags"]
        
        data["meta_json"] = json.dumps(data["meta_json"])
        
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        
        sql = f"INSERT INTO pending_import ({columns}) VALUES ({placeholders})"
        try:
            with conn:
                conn.execute(sql, list(data.values()))
            return True
        except sqlite3.IntegrityError:
            return False

    def remove_pending_import(self, item_id: int):
        """Remove a model from the pending import table."""
        self.execute_non_query("DELETE FROM pending_import WHERE id = ?", (item_id,))

    # --- Tag Operations ---

    def create_tag(self, name: str) -> int:
        """Create a new tag and return its ID."""
        conn = self.get_connection()
        with conn:
            cur = conn.execute("INSERT INTO tags (name) VALUES (?)", (name,))
            tag_id = cur.lastrowid
            conn.execute("UPDATE db_meta SET value = ? WHERE key = 'tags_id_max' AND CAST(value AS INTEGER) < ?", (str(tag_id), tag_id))
            return tag_id

    def upsert_tag_with_id(self, tag_id: int, name: str):
        """Insert or replace a tag with a specific ID. Useful for migrations."""
        conn = self.get_connection()
        with conn:
            conn.execute("INSERT OR REPLACE INTO tags (id, name) VALUES (?, ?)", (tag_id, name))
            # Update max ID tracker if necessary
            conn.execute("UPDATE db_meta SET value = ? WHERE key = 'tags_id_max' AND CAST(value AS INTEGER) < ?", (str(tag_id), tag_id))

    def tag_model(self, model_hash: str, tag_id: int):
        self.execute_non_query("INSERT OR IGNORE INTO model_tags (model_hash, tag_id) VALUES (?, ?)", (model_hash, tag_id))

    def untag_model(self, model_hash: str, tag_id: int):
        self.execute_non_query("DELETE FROM model_tags WHERE model_hash = ? AND tag_id = ?", (model_hash, tag_id))

    def get_tags_for_model(self, model_hash: str) -> List[sqlite3.Row]:
        return self.execute_query("""
            SELECT t.* FROM tags t
            JOIN model_tags mt ON t.id = mt.tag_id
            WHERE mt.model_hash = ?
        """, (model_hash,))

    def get_all_tags(self) -> List[sqlite3.Row]:
        return self.execute_query("SELECT * FROM tags ORDER BY name")

    # --- Meta Operations ---

    def get_meta(self, key: str, default: Any = None) -> Any:
        cur = self.execute_query("SELECT value FROM db_meta WHERE key = ?", (key,))
        return cur[0]["value"] if cur else default

    def set_meta(self, key: str, value: Any):
        self.execute_non_query("INSERT OR REPLACE INTO db_meta (key, value) VALUES (?, ?)", (key, str(value)))