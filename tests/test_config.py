import os
import importlib
from unittest.mock import patch

def test_config_structure():
    assert hasattr(config, "DEV_MODE")
    assert hasattr(config, "DB_PATH")
    assert hasattr(config, "SYSTEM_TYPES")
    
    assert isinstance(config.SYSTEM_TYPES, list)
    
    assert "checkpoints" in config.SYSTEM_TYPES
    assert "loras" in config.SYSTEM_TYPES
    assert "vae" in config.SYSTEM_TYPES


def test_config_env_override():
    with patch.dict(os.environ, {"HIKAZE_DB_PATH": "test_db.sqlite"}):
        # Reload config to pick up env var
        from backend.util import config
        importlib.reload(config)
        assert config.DB_PATH.endswith("test_db.sqlite")

    # Reset (reload again without env var)
    importlib.reload(config)
