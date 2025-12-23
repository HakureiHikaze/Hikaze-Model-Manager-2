# Track Plan: Core Data Foundation & Legacy Migration Engine

## Phase 1: Database Infrastructure (v3 Schema)

- [ ] Task: Create database configuration module
  - Sub-tasks:
    - [ ] Create `backend/config.py` to define DB path and constants.
    - [ ] Implement environment variable overrides for testing configuration.
    - [ ] Write tests to verify configuration loading.

- [ ] Task: Implement Database Manager and Schema Initialization
  - Sub-tasks:
    - [ ] Create `backend/database.py`.
    - [ ] Define the SQL schema for `models`, `tags`, and `model_tags` (v3).
    - [ ] Implement `DatabaseManager` class with `init_db()` method.
    - [ ] Write tests to verify table creation and correct schema (indexes, FKs).

- [ ] Task: Implement Model CRUD Operations
  - Sub-tasks:
    - [ ] Add `upsert_model(model_data)` method to `DatabaseManager`.
    - [ ] Add `get_model(hash)` and `get_model_by_path(path)` methods.
    - [ ] Write unit tests for inserting, updating, and retrieving models.
    - [ ] Write tests for handling duplicate paths (should fail or update depending on logic) and duplicate hashes (should merge).

- [ ] Task: Implement Tag CRUD Operations
  - Sub-tasks:
    - [ ] Add `create_tag(name, color)` and `get_tag(name)` methods.
    - [ ] Add `tag_model(hash, tag_id)` and `untag_model(hash, tag_id)` methods.
    - [ ] Add `get_tags_for_model(hash)` method.
    - [ ] Write unit tests for tag management and model-tag associations.

- [ ] Task: Conductor - User Manual Verification 'Database Infrastructure (v3 Schema)' (Protocol in workflow.md)

## Phase 2: Legacy Migration Service

- [ ] Task: Create Legacy Database Connector
  - Sub-tasks:
    - [ ] Create `backend/migration/legacy_connector.py`.
    - [ ] Implement a read-only connection to an arbitrary SQLite file path.
    - [ ] Implement methods to fetch raw `models` and `tags` data from the legacy schema (v2).
    - [ ] Write tests using a temporary SQLite file representing a v2 DB.

- [ ] Task: Implement Migration Logic (Models)
  - Sub-tasks:
    - [ ] Create `backend/migration/service.py`.
    - [ ] Implement `migrate_models(legacy_conn, new_db_manager)` function.
    - [ ] Logic: Iterates legacy models, validates/calculates SHA256, upserts to new DB.
    - [ ] Write tests:
        - Test with valid legacy model (has hash).
        - Test with legacy model missing hash (should calculate if file exists).
        - Test with missing file (should skip).

- [ ] Task: Implement Migration Logic (Tags)
  - Sub-tasks:
    - [ ] Add `migrate_tags(legacy_conn, new_db_manager)` to service.
    - [ ] Logic: Syncs tags preserving colors.
    - [ ] Logic: Rebuilds `model_tags` associations based on the migrated model hashes.
    - [ ] Write integration test: Full migration flow from a populated v2 DB to a clean v3 DB.

- [ ] Task: Conductor - User Manual Verification 'Legacy Migration Service' (Protocol in workflow.md)
