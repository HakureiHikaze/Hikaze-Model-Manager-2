# Plan - Internal Communication Refactor & Database Streamlining

## Phase 1: Dataclass Finalization and Integration [checkpoint: b8c541f]
- [x] Task: Review and finalize `ModelRecord` and `PendingModelRecord` in `shared/types/model_record.py` to match the current DB schema.
- [x] Task: Update utility functions (e.g., `data_adapters.py`) to handle conversion between these dataclasses and JSON/dict for frontend communication.
- [x] Task: Refactor existing model-fetching logic in `backend/server/library_info_handler.py` and `backend/server/images_handler.py` to use dataclass signatures.
- [x] Task: Conductor - User Manual Verification 'Dataclass Finalization and Integration' (Protocol in workflow.md)

## Phase 2: DatabaseManager Streamlining [checkpoint: d58aa55]
- [x] Task: Refactor `DatabaseManager` to a strict singleton pattern with a primary connection to the internal database.
- [x] Task: Implement typed retrieval methods in `DatabaseManager`:
    - `get_model_by_sha256(sha256: str) -> Optional[ModelRecord]`
    - `get_pending_model_by_id(id: int) -> Optional[PendingModelRecord]`
    - `get_tag_names(tag_ids: List[int]) -> Dict[int, str]`
- [x] Task: Implement the generic parameterized query interface `execute_query(sql, params)`.
- [x] Task: Remove business-logic-heavy methods from `DatabaseManager` that are no longer needed or belong in handlers.
- [x] Task: Conductor - User Manual Verification 'DatabaseManager Streamlining' (Protocol in workflow.md)

## Phase 3: Legacy Adapter and Migration Handler Refactor [checkpoint: c6ec801]
- [x] Task: Create `backend/database/migration/legacy_database_adapter.py` with hardcoded extraction logic for the old schema.
- [x] Task: Implement the extraction function that returns `(List[ModelRecord], List[PendingModelRecord], List[Tuple])`.
- [x] Task: Update `migration_handler.py` to call the legacy adapter and pass the resulting objects to a placeholder migration function.
- [x] Task: Update all references in `backend/database/migration/importer.py` to align with the new dataclass-based flow.
- [x] Task: Conductor - User Manual Verification 'Legacy Adapter and Migration Handler Refactor' (Protocol in workflow.md)

## Phase 4: Final Integrity Check & Clean-up
- [ ] Task: Perform a global search for any remaining raw dictionary model manipulations and convert them to dataclass operations.
- [ ] Task: Ensure `npm run build` (for frontend integration) and basic backend startup tests pass.
- [ ] Task: Conductor - User Manual Verification 'Final Integrity Check & Clean-up' (Protocol in workflow.md)
