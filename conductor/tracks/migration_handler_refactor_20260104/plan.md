# Plan: Backend Migration Handler Refactor

## Phase 1: Analysis & Logic Mapping [checkpoint: 9f2fb5a]
- [x] Task: Audit `migration_handler.py` to identify all business logic, DB queries, and data mapping blocks.
- [x] Task: Evaluate "Logic Evaluation" criteria: Analyze existing gaps in image processing, interruption handling, and atomicity.
- [x] Task: Propose a new service-level API structure for the migration module to the user.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Analysis' (Protocol in workflow.md)

## Phase 2: Logic Relocation & Service Layer Implementation [checkpoint: d6a4442]
- [x] Task: Implement the high-level `MigrationService` in `backend.database.migration`.
- [x] Task: Move Stage 1 orchestration (DB Import -> Image Migration -> Cleanup) to the service layer.
- [x] Task: Move Stage 2 promotion logic and conflict resolution strategies to the service layer.
- [x] Task: Ensure the "Image Migration Fix" (from Phase 2.5 of the previous track) is integrated into the new structure.
- [x] Task: Implement improved error reporting and partial failure tracking in the service layer.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Service Layer' (Protocol in workflow.md)

## Phase 3: Handler Refactoring (Pure Controller)
- [x] Task: Refactor `handle_migrate_legacy_db` to use the new `MigrationService`.
- [x] Task: Refactor `handle_import_models` (and the helper `_import_pending_model`) to use the service layer.
- [x] Task: Clean up imports and remove redundant logic from `migration_handler.py`.
- [ ] Task: Verify API response consistency with the existing frontend.
- [~] Task: Conductor - User Manual Verification 'Phase 3: Handler Refactoring' (Protocol in workflow.md)

## Phase 4: Final Integrity & Robustness
- [ ] Task: Verify fix for Interruption/Resumption scenarios.
- [ ] Task: Final code audit for type safety and adherence to "Pure Controller" pattern.
- [ ] Task: Perform a full manual verification of the migration lifecycle.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Integrity' (Protocol in workflow.md)
