# Track Plan: Architecture Refactor & Legacy Migration

## Phase 1: Architectural Refactoring & Setup
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
- [ ] Task: Conductor - User Manual Verification 'Architectural Refactoring & Setup' (Protocol in workflow.md)

## Phase 2: Image Processing Infrastructure [checkpoint: de0a368]
- [x] Task: Implement Image Processor [ebf36bf]
- [x] Task: Implement Image API Handlers [040be21]
- [x] Task: Verify Image Pipeline [040be21]
- [x] Task: Refactor Image Processor for Multi-Quality [f72d753]
  - Implement 3-tier resolution/quality logic (High/Medium/Low).
  - Update file naming with suffixes.
  - Update API handlers to support quality parameter.
- [ ] Task: Conductor - User Manual Verification 'Image Processing Infrastructure' (Protocol in workflow.md)

## Phase 3: Migration & Development Tools
- [x] Task: Implement Shadow File Generator [41aff96]
  - Create `backend/database/migration/shadow_generator.py`.
  - Implement dummy file creation with structural mirroring and random salting.
- [x] Task: Implement Mock Hasher for Dev Mode [c9bec3f]
  - Add logic to intercept SHA256 calculation in Dev mode to return legacy DB hashes.
- [ ] Task: Implement Initial Legacy Importer
  - Implement logic to read legacy DB and perform the first-pass data and image migration.
- [ ] Task: Conductor - User Manual Verification 'Migration & Development Tools' (Protocol in workflow.md)

## Phase 4: Reactive Migration & Non-blocking API
- [ ] Task: Implement Non-blocking SHA256 Calculator
  - Use `ThreadPoolExecutor` to offload hashing from the async event loop.
- [ ] Task: Implement Reactive Migration Logic
  - Implement the "Move Data + Move Image" flow triggered by calculation success.
- [ ] Task: Implement Unified SHA256 API Endpoint
  - Finalize `POST /api/models/sha256` with logic branching for `pending` status.
- [ ] Task: Verify End-to-End Migration Flow
  - Perform integration testing with legacy data and shadow files.
- [ ] Task: Conductor - User Manual Verification 'Reactive Migration & Non-blocking API' (Protocol in workflow.md)
