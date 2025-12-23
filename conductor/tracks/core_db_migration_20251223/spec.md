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

### 3. Legacy Migration Service
A dedicated module to handle the one-time (or on-demand) import of legacy data.

*   **Input:** Path to the legacy `db.sqlite3` file.
*   **Process:**
    1.  Connect to legacy DB (read-only).
    2.  Fetch all rows from legacy `models`.
    3.  For each legacy model:
        *   **Validation:** Check if `hash_hex` is a valid SHA256. If missing, attempt to calculate from the file at `path` (if it exists). If file is missing, log warning and skip.
        *   **Upsert:** Insert into new DB. If SHA256 exists, update `path` and merge metadata.
    4.  Fetch all legacy `tags` and `model_tags`.
    5.  **Tag Migration:** Ensure all tags exist in the new DB.
    6.  **Association:** Recreate the links between models (by SHA256) and tags.
*   **Output:** A detailed report (JSON/Object) containing counts of processed, migrated, merged, and failed items.

## Testing Strategy
*   **Unit Tests:**
    *   Test schema creation and constraints.
    *   Test CRUD operations for models and tags.
    *   Test SHA256 collision handling (should update/merge).
*   **Integration Tests:**
    *   Create a mock legacy DB with known data (valid and invalid entries).
    *   Run the migration service.
    *   Verify the new DB contains the expected clean data.
