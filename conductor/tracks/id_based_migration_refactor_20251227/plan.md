# Track Plan: ID-Based Reactive Migration Refactor

## Phase 1: Legacy Cleanup & Image Utils

- [x] Task: Update Importer (Stage 1) [a4e6dad]
  - Sub-tasks:
    - [x] Edit `backend/database/migration/importer.py` to strip image paths from `meta_json`.

- [ ] Task: Image Processor Upgrade
  - Sub-tasks:
    - [ ] Update `backend/util/image_processor.py`.
    - [ ] Implement `get_image_list(hash)` (Scanner).
    - [ ] Implement `get_next_sequence_index(hash)`.
    - [ ] Implement `promote_pending_image(pending_img_path, sha256, seq)`.
    - [ ] Update `get_image_path` to handle sequence naming.

- [ ] Task: Conductor - User Manual Verification 'Legacy Cleanup & Image Utils' (Protocol in workflow.md)

## Phase 2: Core Migration Processor

- [ ] Task: Meta & Field Merger
  - Sub-tasks:
    - [ ] Create `backend/util/merger.py`.
    - [ ] Implement `merge_meta_json(old, new)`.
    - [ ] Implement `merge_model_fields(old_row, new_data)`.

- [ ] Task: Migration Processor Logic
  - Sub-tasks:
    - [ ] Re-create `backend/database/migration/processor.py`.
    - [ ] Implement In-Memory Locking.
    - [ ] Implement `process_single_import(id, strategy)` handling all 4 cases.

- [ ] Task: Conductor - User Manual Verification 'Core Migration Processor' (Protocol in workflow.md)

## Phase 3: API Refactor

- [ ] Task: Router Implementation
  - Sub-tasks:
    - [ ] Update `backend/server/router.py`.
    - [ ] Remove `handle_calculate_hash` logic.
    - [ ] Add `handle_import_a_model`.
    - [ ] Add `handle_get_sample_imgs`.
    - [ ] Update `handle_get_image` for sequence filenames.

- [ ] Task: Conductor - User Manual Verification 'API Refactor' (Protocol in workflow.md)

## Phase 4: Verification

- [ ] Task: Final Verification Script
  - Sub-tasks:
    - [ ] Create `scripts/verify_import_flow.py`.
    - [ ] Verify Stage 1 (Clean JSON).
    - [ ] Verify Import (Locking, Merging, Image Sequences).

- [ ] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
