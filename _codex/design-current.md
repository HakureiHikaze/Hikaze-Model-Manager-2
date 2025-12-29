# Hikaze Model Manager 2 - Current Design (Sanitized)

## Scope
- This document consolidates ONLY the design intent that matches the current direction.
- Obsolete logic (e.g., reactive migration and worker-based migration) is intentionally excluded.
- No conductor files are modified; this is a clean reference copy.

## Product Goals
- Provide a unified model manager UI with node entry points for ComfyUI power users.
- Overlay-driven UI maps complex form state to JSON in standard node inputs.
- SHA256 is the canonical identity for cataloging models in the manager.
- Manager UI remains a native-feeling extension of ComfyUI (GitHub-dark aesthetic).

## Data Flow (Authoritative)
1) Backend DB serves model library data to the manager UI.
2) Manager UI resolves model metadata and selects models.
3) Node overlay writes path-only payloads to ComfyUI node inputs via `hikaze_payload` protocol.
4) Backend node execution uses file paths only (server and nodes are decoupled). `hikaze_payload` acts as a data protocol to bypass standard ComfyUI widget limitations.

## Backend Architecture
- Python 3.10+, aiohttp server, SQLite storage.
- Database schema (current):
  - models: sha256 (PK), path, name, type, size_bytes, created_at, meta_json.
  - tags: id, name.
  - model_tags: model_hash + tag_id.
  - pending_import: id (legacy id), path, sha256, name, type, size_bytes, created_at, meta_json.
  - pending_model_tags: model_id + tag_id.
  - db_meta: key/value metadata.
- Backend nodes:
  - `hikaze_payload` is the core data exchange widget.
  - Nodes must parse payloads and operate on absolute paths.
- Other Models Logic:
  - `GET /api/models?type=others` returns models whose type is unknown or not in the system-defined list.
- Model Type Sniffer:
  - Implements `types_cache.json` to store a snapshot of ComfyUI model types and paths for fast retrieval.

## Migration Strategy (Current)
- Stage 1: Legacy import (one-time, no legacy DB after completion).
- Stage 2: Import by pending id.
  - Frontend calls import endpoint with pending id.
  - Backend calculates sha256 (canonical PK), moves record to models, migrates tags.
  - Conflict strategies (override/merge/delete) are handled during this promotion phase.
  - SHA256 calculation is reserved for promotion and is NOT performed for already hashed records in the active library.

## Image Pipeline (Current)
- Active images use: <hash>_<seq>_<quality>.webp.
- Image Deletion: Deleting a sequence index triggers a shift of subsequent images down to maintain a gapless sequence.
- get_img_num endpoint provides the upper bound for sequential image cycling.
- Frontend uses IntersectionObserver for lazy loading:
  - Image request (`/api/images/{hash}.webp?seq=N&quality=medium`) triggers only when card enters viewport.

## Frontend Architecture
- Vue 3 + TypeScript + Vite.
- Data Strategy:
  - "Client-Side Heavy" for model lists.
  - Local reactive search and tag filtering (AND logic, Include/Exclude).
  - Auto-exclusion of 'nsfw' tag on load.
- LoRA JSON Protocol:
  - Unified schema using `LoRAEntry` and `LoRAListDocument` fields (e.g., `full_path`, `strength_model`, `enabled`).
- Model Details Form:
  - Derived from `meta_json` for fields like trigger words and notes.
  - Types fetched dynamically via `GET /api/models/get_types`.

## API Surface (Current)
- /api/migration/migrate_legacy_db (Stage 1 import). (Implemented)
- /api/migration/import_models (Stage 2 import by pending ids). (Implemented)
- /api/images/get_sample_imgs (list sequences for a hash). (Implemented)
- /api/images/{hash}.webp?quality=high|medium|low (active images). (Implemented)
- /api/images/pending/{name}.webp (pending images, original file lookup). (Implemented)
- /api/images/upload (active image upload; uses sequence naming). (Implemented)
- /api/models (list models by type with tags). (Implemented)
- /api/tags (list all system tags). (Implemented)
- /api/models/get_types (list available model types). (Implemented)

## Frontend Architecture
- Vue 3 + TypeScript + Vite.
- Two surfaces:
  - Node overlay UI (custom_node_frontend) for ComfyUI nodes. (Functional)
  - Full-screen manager UI (model_manager_frontend). (Functional MVP)
- Manager layout:
  - Three panes: nav (optional), library, details.
  - Image-first cards; list mode optional.
  - Grid column limit: 2-10.
  - Details panel holds technical metadata only.
- Data Strategy:
  - "Client-Side Heavy" for model lists.
  - Per-category caching in memory (Pinia/Composable) for instant tab switching.
  - Local reactive search and tag filtering (AND logic, Include/Exclude).
  - Auto-exclusion of 'nsfw' tag on load.
- Type tabs:
  - In plugin or standalone manager mode, when the Vue control is not marked embedded, call GET /api/models/get_types.
  - Render the returned type list as the top tab bar.

## UI Constraints
- Node labels and backend logs remain English.
- Base model field is removed from design scope.
- Tags are stored via tags + model_tags relations.
- i18n and Settings API integration are deferred.
- Frontend work is paused until backend import flow stabilizes and integration begins.

## Deprecated (Removed from Current Design)
- MigrationManager/MigrationWorker/processor/merger architecture.
- /api/models/sha256 endpoint and reactive migration trigger.
- Automatic background worker-based migration.

## Dev Notes
- NodeShell.vue remains for frontend dev workflows.
- numbers.ts and lora.ts dev helpers can be removed during frontend cleanup.
- ModelDetails icon encoding issues are de-prioritized.
