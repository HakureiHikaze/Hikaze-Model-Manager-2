# Plan - Model Details Implementation & Image Management

## Phase 1: API Restoration & Extension (Backend)
- [x] Task: Implement `GET /api/models/{sha256}` in `backend/server/router.py`. [d117a3c]
- [x] Task: Implement `GET /api/images/get_img_num?sha256={sha256}` in `backend/server/router.py` and `ImageProcessor`. [20b0eae]
- [ ] Task: Refactor `GET /api/images/{sha256}` to support `seq` query parameter.
- [ ] Task: Implement `DELETE /api/images/delete` with sequence shifting logic in `ImageProcessor`.
- [ ] Task: Implement `POST /api/tags_add` to handle batch creation of new tags.
- [ ] Task: Update `backend/server/router.py` with `PATCH /api/models/{sha256}` for model updates.
- [ ] Task: Conductor - User Manual Verification 'API Restoration & Extension' (Protocol in workflow.md)

## Phase 2: Documentation Correction
- [ ] Task: Update `_codex/backend_apis.md` to reflect new and refactored endpoints.
- [ ] Task: Update `conductor/discrepancies/20251229-2315-discrepancies_fixed.md` to remove the "Redundant" status of the single-model fetch API.
- [ ] Task: Conductor - User Manual Verification 'Documentation Correction' (Protocol in workflow.md)

## Phase 3: Frontend Image Gallery & Tag Components
- [ ] Task: Create `HikazeImageGallery.vue` with 3:4 aspect ratio, navigation, and add/delete controls.
- [ ] Task: Create `HikazeTagInput.vue` (Chip pattern) with autocomplete and multi-stage creation logic.
- [ ] Task: Conductor - User Manual Verification 'Frontend Components' (Protocol in workflow.md)

## Phase 4: Details Pane Integration
- [ ] Task: Update `ModelDetails.vue` to integrate the new Gallery and Tag components.
- [ ] Task: Implement fetching logic for full model data and image count on selection.
- [ ] Task: Implement multi-stage save logic (tags first, then model data).
- [ ] Task: Conductor - User Manual Verification 'Details Pane Integration' (Protocol in workflow.md)

## Phase 5: Model Library Card Enhancement (Refactor)
- [ ] Task: Refactor `ModelLibrary.vue` card image logic to use the new sequence-based API.
- [ ] Task: Implement asynchronous cycling logic (looping) for card previews with fade transitions.
- [ ] Task: Ensure the preview queue updates in real-time when images are added or deleted.
- [ ] Task: Conductor - User Manual Verification 'Model Library Card Enhancement' (Protocol in workflow.md)
