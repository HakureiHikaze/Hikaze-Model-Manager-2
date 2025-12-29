# Plan - Model Details Implementation & Image Management

## Phase 1: API Restoration & Extension (Backend) [checkpoint: 0bceed1]
- [x] Task: Implement `GET /api/models/{sha256}` in `backend/server/router.py`. [d117a3c]
- [x] Task: Implement `GET /api/images/get_img_num?sha256={sha256}` in `backend/server/router.py` and `ImageProcessor`. [20b0eae]
- [x] Task: Refactor `GET /api/images/{sha256}` to support `seq` query parameter. [c68c228]
- [x] Task: Implement `DELETE /api/images/delete` with sequence shifting logic in `ImageProcessor`. [9d9bb80]
- [x] Task: Implement `POST /api/tags_add` to handle batch creation of new tags. [a77c609]
- [x] Task: Update `backend/server/router.py` with `PATCH /api/models/{sha256}` for model updates. [966eb3b]
- [x] Task: Conductor - User Manual Verification 'API Restoration & Extension' (Protocol in workflow.md) [0bceed1]

## Phase 2: Documentation Correction [checkpoint: 390ebcc]
- [x] Task: Update `_codex/backend_apis.md` to reflect new and refactored endpoints. [2fc1cf9]
- [x] Task: Update `conductor/discrepancies/20251229-2315-discrepancies_fixed.md` to remove the "Redundant" status of the single-model fetch API. [065bb77]
- [x] Task: Conductor - User Manual Verification 'Documentation Correction' (Protocol in workflow.md) [390ebcc]

## Phase 3: Frontend Image Gallery & Tag Components [checkpoint: 25d50f6]
- [x] Task: Create `HikazeImageGallery.vue` with 3:4 aspect ratio, navigation, and add/delete controls. [ee27a87]
- [x] Task: Create `HikazeTagInput.vue` (Chip pattern) with autocomplete and multi-stage creation logic. [ee27a87]
- [x] Task: Conductor - User Manual Verification 'Frontend Components' (Protocol in workflow.md) [25d50f6]

## Phase 4: Details Pane Integration [checkpoint: 46ff806]
- [x] Task: Update `ModelDetails.vue` to integrate the new Gallery and Tag components. [c62c946]
- [x] Task: Implement fetching logic for full model data and image count on selection. [c62c946]
- [x] Task: Implement multi-stage save logic (tags first, then model data). [c62c946]
- [x] Task: Conductor - User Manual Verification 'Details Pane Integration' (Protocol in workflow.md) [46ff806]

## Phase 5: Model Library Card Enhancement (Refactor)
- [ ] Task: Refactor `ModelLibrary.vue` card image logic to use the new sequence-based API.
- [ ] Task: Implement asynchronous cycling logic (looping) for card previews with fade transitions.
- [ ] Task: Ensure the preview queue updates in real-time when images are added or deleted.
- [ ] Task: Conductor - User Manual Verification 'Model Library Card Enhancement' (Protocol in workflow.md)
