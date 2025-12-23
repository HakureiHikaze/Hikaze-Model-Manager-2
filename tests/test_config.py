import os
import importlib
from unittest.mock import patch

def test_config_defaults():
    from backend import config
    assert hasattr(config, "DB_PATH")
    assert hasattr(config, "SYSTEM_TAGS")
    assert config.DB_PATH.endswith("hikaze_model_manager.db")
    assert isinstance(config.SYSTEM_TAGS, list)
    # Check against mocked values in conftest.py
    assert "checkpoints" in config.SYSTEM_TAGS
    assert "loras" in config.SYSTEM_TAGS
    assert "vae" in config.SYSTEM_TAGS


def test_config_env_override():
    with patch.dict(os.environ, {"HIKAZE_DB_PATH": "test_db.sqlite"}):
        # Reload config to pick up env var
        from backend import config
        importlib.reload(config)
        assert config.DB_PATH.endswith("test_db.sqlite")

    # Reset (reload again without env var)
    importlib.reload(config)
