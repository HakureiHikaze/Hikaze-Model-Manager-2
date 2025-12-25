import hashlib
import logging
import os
import sqlite3
from typing import Optional
from . import config

logger = logging.getLogger(__name__)

def get_sha256(path: str, legacy_db_path: Optional[str] = None) -> Optional[str]:
    """
    Calculate SHA256 of a file, or return a mock hash in Dev Mode.
    
    Args:
        path: Path to the model file.
        legacy_db_path: Optional path to legacy DB for mock lookup.
        
    Returns:
        The hex digest of the hash.
    """
    filename = os.path.basename(path)
    
    # Check for Dev Mode Interception
    if config.DEV_MODE and filename.startswith("shadow_"):
        return _get_mock_hash(path, legacy_db_path)
        
    # Standard Real Hashing
    return _calculate_real_sha256(path)

def _get_mock_hash(path: str, legacy_db_path: Optional[str]) -> str:
    """Mock hashing logic for shadow files."""
    filename = os.path.basename(path)
    # shadow_file.safetensors -> file.safetensors
    original_filename = filename.replace("shadow_", "", 1)
    
    # 1. Try Lookup in Legacy DB
    if legacy_db_path and os.path.exists(legacy_db_path):
        try:
            conn = sqlite3.connect(legacy_db_path)
            conn.row_factory = sqlite3.Row
            # Try to match by filename (since path changed in shadow system)
            cur = conn.execute("SELECT hash_hex FROM models WHERE name = ?", (original_filename,))
            row = cur.fetchone()
            conn.close()
            
            if row and row["hash_hex"] and len(row["hash_hex"]) == 64:
                logger.info(f"Mock Hasher: Found legacy hash for {filename}")
                return row["hash_hex"]
        except Exception as e:
            logger.error(f"Mock Hasher lookup error: {e}")

    # 2. Fallback: Deterministic Dummy Hash
    # We use a stable hash of the original filename so it's consistent across restarts
    dummy = hashlib.sha256(f"dummy_salt_{original_filename}".encode()).hexdigest()
    logger.info(f"Mock Hasher: Generated dummy hash for {filename}")
    return dummy

def _calculate_real_sha256(path: str) -> Optional[str]:
    """Standard chunked SHA256 calculation."""
    if not os.path.exists(path):
        return None
        
    sha256_hash = hashlib.sha256()
    try:
        with open(path, "rb") as f:
            # Read in 64kb chunks
            for byte_block in iter(lambda: f.read(65536), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        logger.error(f"Error hashing {path}: {e}")
        return None
