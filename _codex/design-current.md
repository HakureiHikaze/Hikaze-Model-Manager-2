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
3) Node overlay writes path-only payloads to ComfyUI node inputs.
4) Backend node execution uses file paths only (server and nodes are decoupled).

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
  - hikaze_payload is the only persisted UI payload.
  - Nodes must parse payloads and operate on absolute paths.

## Migration Strategy (Current)
- Stage 1: Legacy import (one-time, no legacy DB after completion).
  - Hashed models -> models + model_tags.
  - Unhashed models -> pending_import + pending_model_tags (legacy id preserved).
  - Images:
    - Hashed models -> 3-tier WebP in images/ with seq naming.
    - Unhashed models -> original file in images/pending/.
- Stage 2: Import by pending id (no reactive migration).
  - Frontend calls import endpoint with pending id.
  - Backend calculates sha256, moves record to models, migrates tags.
  - Pending record and pending image are removed after promotion.
  - Conflict strategies (override/merge/delete) are part of the import endpoint design.

## Image Pipeline (Current)
- Active images use: <hash>_<seq>_<quality>.webp.
- Pending images store original format under images/pending/ using pending id.
- get_sample_imgs endpoint will list available seq variants for a hash.

## API Surface (Current/Planned)
- /api/migration/migrate_legacy_db (Stage 1 import).
- /api/migration/import_a_model (Stage 2 import by pending id).
- /api/images/get_sample_imgs (list sequences for a hash).
- /api/images/{hash}.webp?quality=high|medium|low (active images).
- /api/images/pending/{name}.webp (pending images, original file lookup).
- /api/images/upload (active image upload; must align with seq naming).

## Frontend Architecture
- Vue 3 + TypeScript + Vite.
- Two surfaces:
  - Node overlay UI (custom_node_frontend) for ComfyUI nodes.
  - Full-screen manager UI (model_manager_frontend).
- Manager layout:
  - Three panes: nav (optional), library, details.
  - Image-first cards; list mode optional.
  - Grid column limit: 2-10.
  - Details panel holds technical metadata only.
- Type tabs:
  - In plugin or standalone manager mode, when the Vue control is not marked embedded, call GET /api/models/get_types.
  - Render the returned type list as the top tab bar.

## UI Constraints
- Node labels and backend logs remain English.
- Base model field is removed from design scope.
- Tags are stored via tags + model_tags relations.
- i18n and Settings API integration are deferred.
- Frontend work is paused until backend import flow stabilizes.

## Deprecated (Removed from Current Design)
- MigrationManager/MigrationWorker/processor/merger architecture.
- /api/models/sha256 endpoint and reactive migration trigger.
- Automatic background worker-based migration.

## Dev Notes
- NodeShell.vue remains for frontend dev workflows.
- numbers.ts and lora.ts dev helpers can be removed during frontend cleanup.
- ModelDetails icon encoding issues are de-prioritized.
