# Specification: Backend Migration Handler Refactor

## Overview
This track focuses on decoupling business logic from the `backend.server.migration_handler` by moving migration orchestration and data processing into the `backend.database.migration` module. The goal is to transform the handler into a "Pure Controller" that only handles request parsing, basic validation, and response formatting, while centralizing migration logic for better maintainability and robustness.

## Scope
- **Target:** `backend.server.migration_handler.py`
- **Logic Relocation:** Move all business orchestration to `backend.database.migration`.
- **Logic Evaluation:** Fix logic gaps related to image migration, interruption/resumption, and partial failures.

## Functional Requirements
1.  **Pure Controller Pattern:**
    - Refactor `handle_migrate_legacy_db` and `handle_import_models` to remove direct business logic.
    - Handlers should only call a single high-level "Migration Service" entry point.
2.  **Centralized Migration Service:**
    - Implement a robust service layer in `backend.database.migration` to handle the multi-stage migration workflow.
    - Relocate conflict resolution strategies (`override`, `merge`, `ignore`) from the handler to this layer.
    - Centralize Tag synchronization and SHA256 mapping logic.
3.  **Logic Repair & Robustness:**
    - **Image Migration Fix:** Ensure `images_count` and 3-tier image compression are correctly applied to both legacy active models and promoted pending models.
    - **Interruption & Resumption:** Ensure the migration process can handle interruptions and provides clear status for resumption.
    - **Partial Failure Handling:** Provide granular reporting for batch promotions, clearly identifying which models succeeded or failed.
4.  **Data Integrity:**
    - Ensure strict `ModelRecord` typing and validation are enforced within the migration layer.

## Non-Functional Requirements
- **Decoupling:** `migration_handler.py` must have zero direct database queries or complex data mapping.
- **Maintainability:** Migration logic should be modular and easily testable outside of the HTTP context.
- **Consistency:** Maintain existing API contract structures where possible, or document necessary changes.

## Acceptance Criteria
- [ ] `migration_handler.py` is reduced to a "Pure Controller" state.
- [ ] Stage 1 migration successfully imports legacy data, processes images (3-tiers), and sets `images_count` correctly.
- [ ] Stage 2 promotion (batch) correctly handles conflicts and reports status per item.
- [ ] The system correctly handles resumption/retry scenarios for migration tasks.
- [ ] Code passes all linting and type checks.

## Out of Scope
- Refactoring of non-migration handlers (e.g., `library_info_handler`).
- Frontend UI changes (beyond adapting to potential API response tweaks).
