import os

# Database Path
# Allow override via environment variable for testing/configuration
DB_FILENAME = os.environ.get("HIKAZE_DB_PATH", "hikaze_model_manager.db")

if not os.path.isabs(DB_FILENAME):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, DB_FILENAME)
else:
    DB_PATH = DB_FILENAME

# System Tags
# Try to get from ComfyUI folder_paths
try:
    import folder_paths
    # folder_names_and_paths is a dict where keys are the folder types (checkpoints, loras, etc.)
    # This matches the user's requirement: "defined from direct child folder of ComfyUI's model folder"
    # effectively, these keys usually map to those folders.
    def get_system_tags():
        return list(folder_paths.folder_names_and_paths.keys())
except ImportError:
    # Fallback for standalone testing/dev
    def get_system_tags():
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

SYSTEM_TAGS = get_system_tags()
