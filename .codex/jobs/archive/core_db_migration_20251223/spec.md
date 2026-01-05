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

*   **`pending_import` Table (Staging Area):**
    *   Stores legacy models that lack a SHA256 hash.
    *   `path` (TEXT, PRIMARY KEY): The file path (legacy ID).
    *   `name` (TEXT)
    *   `type` (TEXT)
    *   `created_at` (INTEGER)
    *   `legacy_tags_json` (TEXT): Serialized list of tags to apply once hashed.

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
    *   `get_pending_imports()`: Fetch uncalculated models.
    *   `remove_pending_import(path)`: Cleanup after processing.

### 3. Legacy Migration Service (Async & Resumable)
A dedicated, asynchronous module to handle the import of legacy data without blocking the main thread.

*   **Architecture:**
    *   **MigrationManager:** The main controller (Singleton). Handles starting, stopping, and querying status.
    *   **MigrationWorker:** A background thread (daemon) that performs the actual processing.
    *   **MigrationState:** A persistent tracking mechanism.

*   **Process Flow:**
    1.  **Immediate Import (Synchronous):**
        *   Connect to legacy DB (read-only).
        *   **Group A (Hashed):** Models with a valid `hash_hex` are inserted directly into the v3 `models` table. Their tags are migrated immediately.
        *   **Group B (Unhashed):** Models missing a hash are inserted into `pending_import`. Their tags are serialized into `legacy_tags_json`.
        *   *Result:* User sees all "Clean" models immediately. "Pending" models await processing.
    2.  **Processing (Background Worker):**
        *   Polls `pending_import` for the next item.
        *   Calculates SHA256 for the file at `path`.
        *   **Upsert:** Inserts the new record into `models`.
        *   **Restore Tags:** Deserializes `legacy_tags_json` and creates entries in `model_tags`.
        *   **Cleanup:** Deletes the row from `pending_import`.
    3.  **Interruption:**
        *   Since the `pending_import` table *is* the queue, no separate state file is needed for the list.
        *   The worker simply stops polling when paused.

*   **API Interface:**
    *   `start_migration(legacy_db_path: str)`: Trigger the Sync import then spawn Worker.
    *   `start_processing_pending()`: Resume worker if there are left-over pending items.
    *   `pause_processing()`: Stop worker.
    *   `get_status()`: Returns counts (Processed vs Pending).


## Testing Strategy
*   **Unit Tests:**
    *   Test schema creation and constraints.
    *   Test CRUD operations for models and tags.
    *   Test SHA256 collision handling (should update/merge).
*   **Integration Tests:**
    *   Create a mock legacy DB with known data (valid and invalid entries).
    *   Run the migration service.
    *   Verify the new DB contains the expected clean data.
