# Plan - Model Details Implementation and Layout Refactor (2025-12-30)

## Phase 1: Sidebar Layout & Resizability
- [x] Task: Create a new `ResizableLayout.vue` component (or refactor `HikazeManagerLayout.vue`) to support a draggable splitter.
    - Implement mouse event handlers for dragging.
    - Bind width state to the details pane style.
    - Ensure default width is 24%.
- [x] Task: Integrate resizable layout into the main App view.
- [ ] Task: Conductor - User Manual Verification 'Sidebar Layout & Resizability' (Protocol in workflow.md)

## Phase 2: Model Details Form Refactor [checkpoint: d305ccd]
- [x] Task: Update `ModelDetails.vue` to remove the "Calculate Hash" button and logic. [refactor]
- [x] Task: Update `ModelDetails.vue` to remove the hardcoded "Model Type" selector (display as read-only text if needed). [refactor]
- [x] Task: Implement the new `meta_json` form fields (`description`, `community_links`, `prompts`) in `ModelDetails.vue`.
    - Map these fields to/from the `meta_json` string in the `localModel` state.
    - Ensure saving correctly serializes these fields back to JSON.
- [x] Task: Verify `deleteImage` functionality in `HikazeImageGallery.vue` (ensure floating delete button exists and works). [fix]
- [x] Task: Refine `ModelDetails.vue`: remove notes/triggers, fix textarea resizing, enhance community links. [refactor]
- [ ] Task: Conductor - User Manual Verification 'Model Details Form Refactor' (Protocol in workflow.md)

## Phase 3: Build Verification & Final Polish [checkpoint: 28d63a6]
- [x] Task: Execute `npm run build` to verify full TypeScript compilation. [build]
- [x] Task: Fix any build errors arising from the refactor. [fix]
- [x] Task: Conductor - User Manual Verification 'Build Verification & Final Polish' (Protocol in workflow.md)
