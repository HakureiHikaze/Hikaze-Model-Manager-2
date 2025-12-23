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

## Phase 2: Legacy Migration Service (Async)

- [ ] Task: Implement Migration State & Queue
  - Sub-tasks:
    - [ ] Create `backend/migration/state.py`.
    - [ ] Define `MigrationState` dataclass/structure (status, counts, current file).
    - [ ] Implement state persistence (save/load to JSON or DB).
    - [ ] Create `MigrationQueue` class to manage the list of pending items.

- [ ] Task: Implement Async Migration Worker
  - Sub-tasks:
    - [ ] Create `backend/migration/worker.py`.
    - [ ] Implement `MigrationWorker` class (inheriting from `threading.Thread`).
    - [ ] Implement chunked SHA256 calculation with `stop_event` checks for interruptibility.
    - [ ] Implement the main processing loop: fetch item -> calc hash (if needed) -> upsert DB -> update state.
    - [ ] Write unit tests for the worker (mocking the hashing to test pause/resume logic).

- [ ] Task: Implement Migration Controller API
  - Sub-tasks:
    - [ ] Create `backend/migration/manager.py` (Singleton).
    - [ ] Implement `start()`, `pause()`, `resume()` methods.
    - [ ] Connect `legacy_connector` to fetch initial data and populate the queue.
    - [ ] Write integration tests: Start migration, pause it, resume it, verify completion.

- [ ] Task: Implement Tag Migration (Integration)
  - Sub-tasks:
    - [ ] Integrate tag migration into the worker flow (or as a separate quick step before/after model migration).
    - [ ] Ensure `model_tags` are correctly rebuilt using the resolved SHA256 hashes.

- [ ] Task: Conductor - User Manual Verification 'Legacy Migration Service (Async)' (Protocol in workflow.md)
