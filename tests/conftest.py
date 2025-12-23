import sys
import pytest
from unittest.mock import MagicMock

# Mock torch
sys.modules["torch"] = MagicMock()

# Mock comfy_api and submodules if needed
comfy_api = MagicMock()
sys.modules["comfy_api"] = comfy_api
sys.modules["comfy_api.latest"] = MagicMock()

# Mock folder_paths
folder_paths = MagicMock()
folder_paths.folder_names_and_paths = {
    "checkpoints": (["/path/to/checkpoints"],),
    "loras": (["/path/to/loras"],),
    "vae": (["/path/to/vae"],)
}
sys.modules["folder_paths"] = folder_paths

@pytest.fixture(autouse=True)
def reset_database_manager():
    """Reset the DatabaseManager singleton before each test."""
    from backend.database import DatabaseManager
    DatabaseManager._instance = None
    yield
