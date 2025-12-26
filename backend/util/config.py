import os

# Development Mode
DEV_MODE = os.environ.get("HIKAZE_DEV_MODE", "false").lower() == "true"

# Base Directories
# This file is in backend/util/config.py
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(ROOT_DIR, "data")
IMAGES_DIR = os.path.join(DATA_DIR, "images")
PENDING_IMAGES_DIR = os.path.join(IMAGES_DIR, "pending")

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PENDING_IMAGES_DIR, exist_ok=True)

# Database Path
DB_FILENAME = os.environ.get("HIKAZE_DB_PATH", "hikaze_model_manager.db")
DB_PATH = os.path.join(DATA_DIR, DB_FILENAME)

# Legacy Database Path (optional)
LEGACY_DB_PATH = os.environ.get("HIKAZE_LEGACY_DB_PATH", "")

# System Types
try:
    import folder_paths
    def get_system_types():
        return list(folder_paths.folder_names_and_paths.keys())
except ImportError:
    def get_system_types():
        return [
            "checkpoints",
            "loras",
            "embeddings",
            "hypernetworks",
            "controlnet",
            "upscale_models",
            "vae",
            "clip",
            "unet",
            "other"
        ]

SYSTEM_TYPES = get_system_types()
