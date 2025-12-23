import pytest
from unittest.mock import patch, MagicMock
import time

def test_migration_manager_flow(tmp_path):
    db_file = tmp_path / "test_db.sqlite"
    legacy_file = tmp_path / "legacy.db" # Mocked inside importer

    with patch("backend.config.DB_PATH", str(db_file)):
        from backend.migration.manager import MigrationManager
        
        manager = MigrationManager()
        
        # Mock importer
        with patch("backend.migration.manager.import_legacy_data") as mock_import:
            mock_import.return_value = {"migrated": 5, "pending": 10}
            
            # Start Full Migration
            report = manager.start_full_migration(str(legacy_file))
            
            assert report["migrated"] == 5
            assert report["pending"] == 10
            mock_import.assert_called_once_with(str(legacy_file))
            
            # Check worker started
            assert manager.is_processing()
            
            # Pause
            manager.pause_processing()
            assert not manager.is_processing()
            
            # Resume
            manager.resume_processing()
            assert manager.is_processing()
            
            # Stop finally
            manager.pause_processing()

def test_singleton(tmp_path):
    with patch("backend.config.DB_PATH", str(tmp_path / "db")):
        from backend.migration.manager import MigrationManager
        m1 = MigrationManager()
        m2 = MigrationManager()
        assert m1 is m2
