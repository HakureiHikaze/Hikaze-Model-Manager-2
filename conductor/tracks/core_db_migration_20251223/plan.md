# Track Plan: Core Data Foundation & Legacy Migration Engine

## Phase 1: Database Infrastructure (v3 Schema)

- [x] Task: Create database configuration module 62312c3
  - Sub-tasks:
    - [ ] Create `backend/config.py` to define DB path and constants.
    - [ ] Implement environment variable overrides for testing configuration.
    - [ ] Write tests to verify configuration loading.

- [x] Task: Implement Database Manager and Schema Initialization 2ab44fb
  - Sub-tasks:
    - [ ] Create `backend/database.py`.
    - [ ] Define the SQL schema for `models`, `tags`, `model_tags`, and the new `pending_import` table.
    - [ ] Implement `DatabaseManager` class with `init_db()` method.
    - [ ] Write tests to verify table creation and correct schema (indexes, FKs).

- [x] Task: Implement Model CRUD Operations 05b25a9
  - Sub-tasks:
    - [ ] Add `upsert_model(model_data)` method to `DatabaseManager`.
    - [ ] Add `get_model(hash)` and `get_model_by_path(path)` methods.
    - [ ] Add `get_pending_imports()` and `remove_pending_import(path)` for staging table management.
    - [ ] Write unit tests for inserting, updating, and retrieving models from both tables.

- [x] Task: Implement Tag CRUD Operations c579a99
  - Sub-tasks:
    - [ ] Add `create_tag(name, color)` and `get_tag(name)` methods.
    - [ ] Add `tag_model(hash, tag_id)` and `untag_model(hash, tag_id)` methods.
    - [ ] Write unit tests for tag management and model-tag associations.

- [x] Task: Conductor - User Manual Verification 'Database Infrastructure (v3 Schema)' (Protocol in workflow.md) [checkpoint: 26ffdf8]

## Phase 2: Legacy Migration Service (Async with Staging)

- [ ] Task: Implement Synchronous Import (Stage 1)
  - Sub-tasks:
    - [ ] Create `backend/migration/importer.py`.
    - [ ] Implement `import_legacy_data(legacy_db_path)`:
        - Reads legacy DB.
        - Writes hashed models to `models`.
        - Writes unhashed models to `pending_import` (serializing tags to JSON).
    - [ ] Write tests using a mock legacy DB with mixed (hashed/unhashed) data.

- [ ] Task: Implement Async Migration Worker (Stage 2)
  - Sub-tasks:
    - [ ] Create `backend/migration/worker.py`.
    - [ ] Implement `MigrationWorker` thread.
    - [ ] Logic: Loop through `pending_import` items.
    - [ ] Logic: Calculate Hash -> Move to `models` -> Deserialize tags -> Link tags -> Delete from `pending_import`.
    - [ ] Implement `stop_event` for graceful pausing.
    - [ ] Write unit tests for the worker consuming the staging table.

- [ ] Task: Implement Migration Controller API
  - Sub-tasks:
    - [ ] Create `backend/migration/manager.py` (Singleton).
    - [ ] Integrate Importer and Worker.
    - [ ] Implement `start_full_migration()`, `pause_processing()`, `resume_processing()`.
    - [ ] Write integration tests: Full flow from Legacy DB -> Staging -> Final DB.

- [ ] Task: Conductor - User Manual Verification 'Legacy Migration Service (Async with Staging)' (Protocol in workflow.md)
