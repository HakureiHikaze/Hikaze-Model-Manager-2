# Plan: Model Scan Integration

## Phase 1: API and Infrastructure [checkpoint: 090e4ee]
- [x] Task: Add `ScanResponse` interface to `web/shared/types/api.ts`.
- [x] Task: Add `scanModels` function to `web/model_manager_frontend/src/api/models.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API and Infrastructure' (Protocol in workflow.md)

## Phase 2: Standalone Implementation [checkpoint: 26527d7]
- [x] Task: Implement `isScanning` and `runScan` logic in `web/model_manager_frontend/src/App.vue`.
- [x] Task: Add "Scan" button to `FloatingToolbar` in `web/model_manager_frontend/src/App.vue`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Standalone Implementation' (Protocol in workflow.md)

## Phase 3: Embedded Modal Implementation [checkpoint: 06f47b7]
- [x] Task: Implement `isScanning` and `runScan` logic in `web/custom_node_frontend/src/components/HikazeManagerModal.vue`.
- [x] Task: Add "Scan" button to modal toolbar in `web/custom_node_frontend/src/components/HikazeManagerModal.vue`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Embedded Modal Implementation' (Protocol in workflow.md)

## Phase 4: Finalization [checkpoint: 8b2810d]
- [x] Task: Final review and verification.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization' (Protocol in workflow.md)
