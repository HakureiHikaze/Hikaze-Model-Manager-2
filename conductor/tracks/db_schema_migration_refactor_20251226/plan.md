# Track Plan: Database Schema and Migration Refactor

## Phase 1: Schema and Metadata [checkpoint: 36c6a56]
- [x] Task: Define db_meta k/v table (db_version, tags_id_max) [91d5af8]
- [x] Task: Update tags schema to id and name only [bd71fc7]
- [x] Task: Update pending_import schema (legacy id PK, path UNIQUE, sha256 NULL) [be1dc04]
- [x] Task: Add or confirm pending_model_tags table [be1dc04]
- [x] Task: Remove rating field from schema [c179e2c]
- [x] Task: Rename system_tags to system_types in config [678b124]
- [x] Task: Conductor - User Manual Verification 'Schema and Metadata' (Protocol in workflow.md)

## Phase 2: Database Manager Refactor
- [ ] Task: Add dual-handle manager (primary + legacy)
- [ ] Task: Implement LegacyDatabaseReader (read-only)
- [ ] Task: Enforce legacy read-only (SQLite mode=ro)
- [ ] Task: Lazy init legacy handle; missing path raises error
- [ ] Task: Propagate legacy init errors to API (502)
- [ ] Task: Conductor - User Manual Verification 'Database Manager Refactor' (Protocol in workflow.md)

## Phase 3: Migration Pipeline Updates
- [ ] Task: One-pass legacy routing to models or pending_import
- [ ] Task: Preserve legacy tags and pending tags via ids
- [ ] Task: Write tags_id_max after migration and sync on tag creation
- [ ] Task: Log and skip pending_import.path unique conflicts (full records)
- [ ] Task: Conductor - User Manual Verification 'Migration Pipeline Updates' (Protocol in workflow.md)

## Phase 4: Pending Import APIs
- [ ] Task: Add API to list pending models
- [ ] Task: Add batch import API (/import_pending_models)
- [ ] Task: Add single import API (/import_a_pending_model) with strategy handling
- [ ] Task: Implement conflict response structure (full records)
- [ ] Task: Conductor - User Manual Verification 'Pending Import APIs' (Protocol in workflow.md)

## Phase 5: Frontend Pending UX
- [ ] Task: Add Pending tab in manager
- [ ] Task: Add checkbox selection on cards and list
- [ ] Task: Add batch import button (disabled until selection)
- [ ] Task: Add conflict decision modal (overwrite/skip/merge)
- [ ] Task: Conductor - User Manual Verification 'Frontend Pending UX' (Protocol in workflow.md)
