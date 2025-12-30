# Plan - Floating Function Panel & Pending Models API

## Phase 1: Backend API Implementation
- [x] Task: Implement `GET /api/migration/get_pending_count` in `backend/server/router.py`.
    - Query the `pending_import` table for the total count.
- [x] Task: Implement `GET /api/migration/get_pending_models` in `backend/server/router.py`.
    - Support optional `type` filter.
    - Return list of models matching the `pending_import` schema.
- [x] Task: Implement `GET /api/migration/get_pending_model` in `backend/server/router.py`.
    - Fetch single record by ID.
- [x] Task: Conductor - User Manual Verification 'Backend API Implementation' (Protocol in workflow.md)

## Phase 2: Frontend Data Layer
- [x] Task: Add API service methods in `web/model_manager_frontend/src/api/migration.ts` (create file if needed).
    - `fetchPendingCount()`
    - `fetchPendingModels(type?)`
    - `fetchPendingModel(id)`
- [x] Task: Update `models.ts` or create types for PendingModel to match the backend response.
- [x] Task: Conductor - User Manual Verification 'Frontend Data Layer' (Protocol in workflow.md)

## Phase 3: Floating Panel Component
- [x] Task: Create `web/model_manager_frontend/src/components/HikazeFloatingPanel.vue`.
    - Implement base HTML structure/styles (fixed positioning, z-index).
    - Implement draggable logic (mousedown, mousemove, mouseup) constrained to parent.
- [x] Task: Implement "Pending Models" badge in the panel.
- [x] Task: Implement Dynamic Button System.
- [x] Task: Integrate `HikazeFloatingPanel` into the main `HikazeManagerModal.vue` (or `App.vue` depending on modal structure).
- [x] Task: Conductor - User Manual Verification 'Floating Panel Component' (Protocol in workflow.md)

## Phase 4: Integration & Polish
- [x] Task: Verify persistence of panel position when switching tabs (ensure component is kept alive or state is lifted).
- [x] Task: Execute `npm run build` to verify full TypeScript compilation. [build]
- [x] Task: Fix any build errors arising from the new component. [fix]
- [x] Task: Conductor - User Manual Verification 'Integration & Polish' (Protocol in workflow.md)
