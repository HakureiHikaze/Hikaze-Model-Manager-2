# Discrepancy Report - 2025-12-29 22:45

## Executive Summary
The project codebase is largely aligned with the architectural design defined in `_codex/` and `conductor/`. However, several functional gaps and technical debt items have been identified that should be addressed before major new feature development.

---

## 1. Missing Core APIs
- **Description:** `GET /api/models/{sha256}` (Model Detail) and `PATCH /api/models/{sha256}` (Model Update) are not implemented.
- **Impact:** High. The frontend "Details" pane currently lacks a way to fetch full metadata or update model fields (names, tags), which is a core product requirement.
- **Advice:** Implement these endpoints in `backend/server/router.py` using `DatabaseManager` methods.

## 2. Lack of Automatic Model Scanning
- **Description:** `POST /api/models/scan` is missing implementation.
- **Impact:** Medium. Users must rely on manual database entries or legacy migration to add models. There is no way to sync the database with new files added to ComfyUI model directories.
- **Advice:** Implement a scanner in `backend/util/scanner.py` (or similar) that iterates through `folder_paths.get_filename_list` and adds missing paths to `pending_import`.

## 3. Deprecated Endpoint Cleanup
- **Description:** `POST /api/migration/import_a_model` is present but marked as deprecated in favor of `import_models`.
- **Impact:** Low (Maintainability). Having redundant logic increases maintenance overhead and potential for bugs.
- **Advice:** Remove `handle_import_a_model` and the internal `_import_pending_model` (once fully integrated into the batch handler) after confirming frontend compatibility.

## 4. Architectural Decoupling (Database Logic)
- **Description:** `DatabaseManager` handles some high-level logic (like conflict strategies) that might be better suited for a "Service" layer or the router itself to keep the DB manager strictly about persistence.
- **Impact:** Low (Scalability). As logic grows, `db.py` will become bloated.
- **Advice:** Consider a `backend/database/migration/processor.py` (as suggested in previous track plans) to handle the complex "Import" logic, leaving `db.py` to handle simple CRUD and schema management.

## 5. Metadata Handling (meta_json)
- **Description:** Some models still have "heavy" metadata including image paths that were supposed to be stripped in Phase 1 of previous tracks.
- **Impact:** Low (Performance). Large JSON blobs in the database can slow down library listing.
- **Advice:** Ensure `strip_meta_images()` is run consistently and consider adding a database migration script to clean up existing records.
