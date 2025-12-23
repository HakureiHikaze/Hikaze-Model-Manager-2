import sys
from unittest.mock import MagicMock

# Mock torch
sys.modules["torch"] = MagicMock()

# Mock comfy_api and submodules if needed
comfy_api = MagicMock()
sys.modules["comfy_api"] = comfy_api
sys.modules["comfy_api.latest"] = MagicMock()
