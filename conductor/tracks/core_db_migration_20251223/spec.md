# Track Specification: Core Data Foundation & Legacy Migration Engine

## Overview
This track focuses on establishing the robust data backend for Hikaze Model Manager 2. The primary goal is to transition from a path-based identity system to a content-addressable system using SHA256 hashes. This ensures that model metadata and tags persist even if files are moved or renamed. Additionally, a migration engine will be built to import data from the legacy v2 database.

## Requirements

### 1. Database Schema (v3)
The new SQLite schema must prioritize data integrity and hash-based lookups.

*   **`models` Table:**
    *   `sha256` (TEXT, PRIMARY KEY): The unique SHA256 hash of the model file.
    *   `path` (TEXT, NOT NULL): The current file path. Indexed for fast lookups.
    *   `name` (TEXT): Display name of the model.
    *   `type` (TEXT): Model category (e.g., CHECKPOINT, LORA).
    *   `base` (TEXT): Base model type (e.g., SD1.5, SDXL).
    *   `size_bytes` (INTEGER): File size.
    *   `created_at` (INTEGER): Timestamp (ms).
    *   `last_used_at` (INTEGER): Timestamp (ms) for LRU logic.
    *   `meta_json` (TEXT): JSON blob for flexible metadata.

*   **`tags` Table:**
    *   `id` (INTEGER, PRIMARY KEY AUTOINCREMENT)
    *   `name` (TEXT, UNIQUE, NOT NULL)
    *   `color` (TEXT): Hex color code.
    *   `created_at` (INTEGER)

*   **`model_tags` Table:**
    *   `model_hash` (TEXT, FOREIGN KEY references `models.sha256`)
    *   `tag_id` (INTEGER, FOREIGN KEY references `tags.id`)
    *   Primary Key: `(model_hash, tag_id)`

### 2. Database Manager Class
*   Singleton or dependency-injected class to handle DB connections and queries.
*   Methods for:
    *   `init_db()`: Create tables if not exist.
    *   `get_model(hash)`: Retrieve by SHA256.
    *   `get_model_by_path(path)`: Retrieve by current path.
    *   `add_model(model_data)`: Insert or update model.
    *   `add_tag(name, color)`: Create tag.
    *   `tag_model(hash, tag_name)`: Associate tag with model.

### 3. Legacy Migration Service (Async & Resumable)
A dedicated, asynchronous module to handle the import of legacy data without blocking the main thread.

*   **Architecture:**
    *   **MigrationManager:** The main controller (Singleton). Handles starting, stopping, and querying status.
    *   **MigrationWorker:** A background thread (daemon) that performs the actual processing.
    *   **MigrationState:** A persistent tracking mechanism (e.g., a specific table in the DB or a JSON state file) to record:
        *   `status`: (IDLE, RUNNING, PAUSED, COMPLETED, ERROR)
        *   `total_items`: Total number of models to migrate.
        *   `processed_items`: Number of models successfully migrated or skipped.
        *   `current_item`: The file currently being hashed (for UI feedback).

*   **Process Flow:**
    1.  **Initialization:**
        *   Connect to legacy DB (read-only).
        *   Identify all legacy models.
        *   Populate a `migration_queue` (in-memory or DB-backed) with items that are *not* yet in the new DB.
    2.  **Execution (Background Thread):**
        *   Fetch next item from queue.
        *   **Check Resumability:** Verify if the item is already processed.
        *   **Hash Calculation:** If `hash_hex` is missing, calculate SHA256 in chunks (to allow interruption).
        *   **Upsert:** Write to new DB.
        *   **Update State:** detailed progress is saved.
    3.  **Interruption:**
        *   The worker checks a `stop_event` flag between file chunks or after each file.
        *   If paused/stopped, the current state is saved to disk so it can be resumed later.

*   **API Interface:**
    *   `start_migration(legacy_db_path: str)`: Spawns the worker.
    *   `pause_migration()`: Signals worker to stop after current operation (or chunk).
    *   `get_migration_status()`: Returns `{ status, progress: %, current_file, stats }`.


## Testing Strategy
*   **Unit Tests:**
    *   Test schema creation and constraints.
    *   Test CRUD operations for models and tags.
    *   Test SHA256 collision handling (should update/merge).
*   **Integration Tests:**
    *   Create a mock legacy DB with known data (valid and invalid entries).
    *   Run the migration service.
    *   Verify the new DB contains the expected clean data.
