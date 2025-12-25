import os
import sqlite3
import random
import logging
from typing import Dict

logger = logging.getLogger(__name__)

def generate_shadow_files(legacy_db_path: str, debug_root: str) -> Dict[str, int]:
    """
    Generate dummy files mirroring the original model structure from legacy DB.
    
    Args:
        legacy_db_path: Path to the legacy hikaze_mm.sqlite3.
        debug_root: Path where shadow files should be created.
        
    Returns:
        A report with success/error counts.
    """
    report = {"processed": 0, "errors": 0}
    
    if not os.path.exists(legacy_db_path):
        logger.error(f"Legacy DB not found: {legacy_db_path}")
        return report

    try:
        conn = sqlite3.connect(legacy_db_path)
        conn.row_factory = sqlite3.Row
        
        cur = conn.execute("SELECT path FROM models")
        rows = cur.fetchall()
        
        for row in rows:
            original_path = row["path"]
            if not original_path:
                continue
                
            try:
                # 1. Map path to Debug Root
                # Handle Windows drive letters (Z:\path -> Z\path)
                safe_rel_path = original_path.replace(":", "")
                # Ensure no leading slash for joining
                if safe_rel_path.startswith("\\") or safe_rel_path.startswith("/"):
                    safe_rel_path = safe_rel_path[1:]
                
                # Split into dir and filename
                dir_part, filename = os.path.split(safe_rel_path)
                shadow_filename = f"shadow_{filename}"
                
                # Full target path
                target_dir = os.path.join(debug_root, dir_part)
                target_file = os.path.join(target_dir, shadow_filename)
                
                # 2. Create Directory
                os.makedirs(target_dir, exist_ok=True)
                
                # 3. Create Shadow File with Salt
                # We write a small amount of random data to ensure uniqueness
                salt = os.urandom(16)
                with open(target_file, "wb") as f:
                    f.write(salt)
                
                logger.debug(f"Created shadow file: {target_file}")
                report["processed"] += 1
                
            except Exception as e:
                logger.error(f"Error creating shadow for {original_path}: {e}")
                report["errors"] += 1
                
        conn.close()
        
    except Exception as e:
        logger.error(f"Shadow generation failed: {e}")
        report["errors"] += 1
        
    return report

if __name__ == "__main__":
    # Test execution
    logging.basicConfig(level=logging.INFO)
    # Example usage (commented out)
    # generate_shadow_files("path/to/legacy.db", "path/to/debug_models")
    pass
