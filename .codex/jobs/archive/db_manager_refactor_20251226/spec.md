# Track Specification: Database Manager Refactor

## Overview
Refactor `backend/database/db.py` to simplify the `DatabaseManager` into a single, cohesive unit. This involves removing the deprecated legacy database adapter/handle while strictly preserving the schema and logic required for long-term compatibility (pending imports, metadata). Additionally, ensure all database paths and configuration signals are sourced exclusively from `backend/util/config.py`, removing any direct environment variable lookups within the database module.

## Goals
- Simplify `DatabaseManager` by removing the dual-handle architecture (primary + legacy).
- Ensure `pending_import`, `pending_model_tags`, and `db_meta` are preserved as core architectural components.
- Decouple migration logic from the main `DatabaseManager`; migration tools should manage their own connections to legacy files.
- Centralize all configuration access via `backend/util/config.py`.

## Functional Requirements

### 1. Database Manager Simplification
- **Remove:** `_DatabaseHandle` wrapper class if it only serves to support the dual-handle logic (or simplify it if used for thread-local management).
- **Remove:** `LegacyDatabaseReader` class.
- **Remove:** `self.legacy` property and `get_legacy_connection()` / `get_legacy_reader()` methods from `DatabaseManager`.
- **Retain:** `DatabaseManager` class as the singleton interface for the application database.
- **Retain:** All CRUD methods for `models`, `tags`, `model_tags`, `pending_import`, `pending_model_tags`, and `db_meta`.
- **Constraint:** The database schema (tables, columns, keys) MUST remain unchanged.

### 2. Configuration & Path Management
- **Action:** Ensure `DatabaseManager` initializes its connection using *only* `config.DB_PATH`.
- **Cleanup:** Remove any direct `os.environ.get()` calls within `db.py`. All configuration must come from the `backend.util.config` module.

### 3. Migration Logic Adjustment
- **Refactor:** Update `backend/database/migration/importer.py` (and any other migration consumers) to instantiate their own `sqlite3.connect()` connection for the legacy database path provided by the API. They must NOT attempt to call `db.get_legacy_connection()`.

## Non-Functional Requirements
- **Thread Safety:** Continue to use thread-local storage for SQLite connections within `DatabaseManager`.
- **Compatibility:** Ensure no regression in the application's ability to read/write pending models or system metadata.

## Acceptance Criteria
- `backend/database/db.py` no longer contains `LegacyDatabaseReader` or references to a legacy handle.
- The application starts and connects to the primary database successfully using the path from `config.py`.
- Migration API works correctly by establishing its own connection to the legacy file.
- `pending_import` and `db_meta` tables function as expected.
