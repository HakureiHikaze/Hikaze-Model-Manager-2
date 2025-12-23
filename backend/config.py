import os

# Database Path
# Allow override via environment variable for testing/configuration
DB_FILENAME = os.environ.get("HIKAZE_DB_PATH", "hikaze_model_manager.db")

# If it's just a filename, make it relative to the package directory or current working directory?
# The test checks .endswith(), so absolute path is fine.
# Let's match the legacy behavior or standard practice: store in the package dir or a user data dir.
# For now, let's keep it simple: if it's not absolute, make it relative to this file's parent (the package root).
if not os.path.isabs(DB_FILENAME):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, DB_FILENAME)
else:
    DB_PATH = DB_FILENAME

# System Tags
SYSTEM_TAGS = [
    "checkpoint",
    "lora",
    "embedding",
    "hypernetwork",
    "controlnet",
    "upscale",
    "vae",
    "clip",
    "unet",
    "other"
]
