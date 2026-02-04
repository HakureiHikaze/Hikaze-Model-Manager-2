# Plan: UI Refactor - Fullscreen Modal & Global Entry

## Phase 1: Context Menu & Global Entry [checkpoint: 35283db]
- [x] Task: Implement context menu registration in `web/custom_node_frontend/extensions/hikaze-model-manager.js`.
- [x] Task: Implement port discovery and "Open New Tab" logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Context Menu & Global Entry' (Protocol in workflow.md)

## Phase 2: Fullscreen Modal Refactor [checkpoint: 119ccce]
- [x] Task: Analyze `HikazeManagerModal.vue` and `modalService.ts`.
- [x] Task: Refactor `HikazeManagerModal.vue` to force `isFullscreen = true` by default and remove the toggle button.
- [x] Task: Verify that `FloatingToolbar.vue` inside the modal does not overlap or conflict with fullscreen layout.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Fullscreen Modal Refactor' (Protocol in workflow.md)

## Phase 3: LoRA Power Loader Analysis [checkpoint: b3742f2]
- [x] Task: Analyze `HikazeLoraPowerLoaderOverlay.vue` and related controllers.
- [x] Task: Draft analysis report on data sync and multi-select flow.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: LoRA Power Loader Analysis' (Protocol in workflow.md)