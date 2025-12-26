# Track Plan: Architecture Refactor & Legacy Migration

## Phase 1: Architectural Refactoring & Setup [checkpoint: 607ed39]
- [x] Task: Reorganize Directory Structure [f03402b]
  - Create `backend/database/`, `backend/util/`, `backend/server/` packages.
  - Create `data/` and `data/images/pending/` directories.
- [x] Task: Move Database and Config [b70a87d]
  - Move `backend/database.py` -> `backend/database/db.py`.
  - Move `backend/migration/` -> `backend/database/migration/`.
  - Move `backend/config.py` -> `backend/util/config.py`.
- [x] Task: Refactor Server Instance and Router [9293468]
  - Move `backend/server.py` logic to `backend/server/instance.py`.
  - Create `backend/server/router.py` and extract API routes.
  - Fix all internal imports across the project.
- [x] Task: Update Project Environment [f3dd5a3]
  - Add `data/` to `.gitignore`.
- [x] Task: Conductor - User Manual Verification 'Architectural Refactoring & Setup' (Protocol in workflow.md) [607ed39]

## Phase 2: Image Processing Infrastructure [checkpoint: 5f390d2]
- [x] Task: Implement Image Processor [ebf36bf]
- [x] Task: Implement Image API Handlers [040be21]
- [x] Task: Verify Image Pipeline [040be21]
- [x] Task: Refactor Image Processor for Multi-Quality [f72d753]
  - Implement 3-tier resolution/quality logic (High/Medium/Low).
  - Update file naming with suffixes.
  - Update API handlers to support quality parameter.
- [x] Task: Conductor - User Manual Verification 'Image Processing Infrastructure' (Protocol in workflow.md) [5f390d2]

## Phase 3: Refactor - Stage 1: Legacy Import
- [x] Task: Clean up redundant migration tools (Shadow Generator, Mock Hasher) [6015ef4]
- [x] Task: Refactor Legacy Importer for One-Time DB Migration [8edffba]
  - Implement `import_legacy_data` with logic to split data into `models` (hashed) and `pending_import` (unhashed).
  - Ensure Legacy Tags are preserved and mapped correctly.
- [x] Task: Implement Legacy Image Migration Logic [8edffba]
  - Implement search logic for images in `legacy_images_dir` based on filenames.
  - Implement multi-quality compression for Active models with naming conflict resolution (`<hash>_<seq>_<quality>.webp`).
  - Implement copy logic for Pending models to `data/images/pending/`.
- [x] Task: Implement One-Time Migration API [8edffba]
  - Create `POST /api/migration/migrate_legacy_db` endpoint.
- [~] Task: Conductor - User Manual Verification 'Stage 1 Legacy Import' (Protocol in workflow.md)

## Phase 4: Stage 2: Reactive Migration & API
- [ ] Task: Implement Non-blocking SHA256 Calculator
  - Use `ThreadPoolExecutor` to offload hashing.
- [ ] Task: Implement Reactive Migration Logic
  - Triggered by hash calculation.
  - Move record from `pending_import` to `models`.
  - Process/Move pending image to active storage with multi-quality compression.
- [ ] Task: Implement Unified SHA256 API Endpoint
  - Finalize `POST /api/models/sha256` to trigger Stage 2.
- [ ] Task: Conductor - User Manual Verification 'Stage 2 Reactive Migration' (Protocol in workflow.md)
