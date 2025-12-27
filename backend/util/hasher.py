import hashlib
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

def get_sha256(path: str) -> Optional[str]:
    """
    Calculate SHA256 of a file.
    
    Args:
        path: Path to the model file.
        
    Returns:
        The hex digest of the hash.
    """
    return _calculate_real_sha256(path)

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
