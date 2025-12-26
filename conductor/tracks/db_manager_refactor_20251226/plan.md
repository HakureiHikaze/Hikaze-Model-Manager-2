# Track Plan: Database Manager Refactor

## Phase 1: Database Manager Simplification [checkpoint: 1b166d1]
- [x] Task: Remove `LegacyDatabaseReader` class and `self.legacy` logic from `db.py`
- [x] Task: Refactor `_DatabaseHandle` and `DatabaseManager` to support a single primary connection
- [x] Task: Centralize database path sourcing to `config.DB_PATH` (remove `os.environ` lookups)
- [x] Task: Verify that `pending_import`, `pending_model_tags`, and `db_meta` CRUD methods are intact
- [x] Task: Conductor - User Manual Verification 'Database Manager Simplification' (Protocol in workflow.md)

## Phase 2: Migration & API Refactor
- [x] Task: Update `backend/database/migration/importer.py` to use standalone `sqlite3` connections for legacy files
- [x] Task: Remove legacy DB handle references from `backend/server/router.py`
- [x] Task: Conductor - User Manual Verification 'Migration & API Refactor' (Protocol in workflow.md)

## Phase 3: Final Verification [checkpoint: 8e10772]
- [x] Task: Create a manual verification script for DatabaseManager functionality (CRUD, Connection).
- [x] Task: Create a manual verification script for Legacy Migration (Connection, Import).
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
