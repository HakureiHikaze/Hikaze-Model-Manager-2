import sqlite3
import json
import logging
from typing import List, Tuple, Dict, Any
from shared.types.model_record import ModelRecord, PendingModelRecord
from shared.types.data_adapters import DataAdapters

logger = logging.getLogger(__name__)

class LegacyDatabaseAdapter:
    """
    Adapter for the old database schema.
    Hardcoded to extract data and convert to the new dataclass-based system.
    """
    def __init__(self, db_path: str):
        self.db_path = db_path

    def get_all_data(self) -> Tuple[List[Tuple[ModelRecord, int]], List[PendingModelRecord], Dict[int, List[int]], Dict[int, str]]:
        """
        Extracts all relevant data from the legacy database.
        Returns:
            - List of (ModelRecord, legacy_id)
            - List of PendingModelRecord (unhashed models, id already in record)
            - Dict of legacy_model_id to tag_ids mapping
            - Dict of tag_id to tag_name mapping
        """
        conn = None
        try:
            conn = sqlite3.connect(f"file:{self.db_path}?mode=ro", uri=True)
            conn.row_factory = sqlite3.Row
            
            # 1. Fetch Tags
            tags_map = {row["id"]: row["name"] for row in conn.execute("SELECT id, name FROM tags").fetchall()}
            
            # 2. Fetch Tag Relationships
            tag_relationships: Dict[int, List[int]] = {}
            rel_rows = conn.execute("SELECT model_id, tag_id FROM model_tags").fetchall()
            for row in rel_rows:
                tag_relationships.setdefault(row["model_id"], []).append(row["tag_id"])
            
            # 3. Fetch Models
            active_models: List[Tuple[ModelRecord, int, List[str]]] = []
            pending_models: List[PendingModelRecord] = []
            
            models_rows = conn.execute("SELECT * FROM models").fetchall()
            for row in models_rows:
                row_dict = dict(row)
                legacy_id = row_dict.get("id") or 0
                
                normalized = {
                    "sha256": row_dict.get("hash_hex") or "",
                    "path": row_dict.get("path") or "",
                    "name": row_dict.get("name") or "",
                    "type": row_dict.get("type") or "",
                    "size_bytes": row_dict.get("size_bytes") or 0,
                    "created_at": row_dict.get("created_at") or 0,
                    "id": legacy_id
                }
                
                meta_raw = row_dict.get("extra_json")
                if isinstance(meta_raw, str) and meta_raw.strip():
                    try:
                        normalized["meta_json"] = json.loads(meta_raw)
                    except:
                        normalized["meta_json"] = {}
                else:
                    normalized["meta_json"] = {}

                images = normalized["meta_json"].get("images", [])

                sha = normalized["sha256"]
                if sha and len(sha) == 64:
                    active_models.append((DataAdapters.dict_to_model_record(normalized), legacy_id, images))
                else:
                    pending_models.append(DataAdapters.dict_to_pending_model_record(normalized))
                    
            return active_models, pending_models, tag_relationships, tags_map

        except Exception as e:
            logger.exception(f"Failed to extract data from legacy database at {self.db_path}")
            raise
        finally:
            if conn:
                conn.close()