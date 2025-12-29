# Discrepancy Report - 2025-12-29 23:15 (Fixed)

## Executive Summary
This report refines the findings from the initial audit based on product owner feedback. It serves as the definitive guide for immediate cleanup and future roadmap items.

---

## 1. API Redundancy: `GET /api/models/{sha256}`
- **Status:** **Redundant / To Remove**
- **Analysis:** The frontend `ModelLibrary` already fetches all necessary metadata (including SHA256) via `GET /api/models`. The details pane uses this local data. Therefore, a dedicated single-model fetch endpoint is unnecessary overhead.
- **Action:** Remove references to `GET /api/models/{sha256}` from `_codex/backend_apis.md` and design docs. Do NOT implement.
- **Note:** `PATCH /api/models/{sha256}` is still required for updating model details (tags, name).

## 2. Automatic Model Scanning
- **Status:** **Planned / Legitimate Design**
- **Analysis:** The absence of `POST /api/models/scan` is a known state. It is a planned feature for a future track, not a discrepancy or bug.
- **Action:** No immediate action required. Implement in a future "Auto-Discovery" track.

## 3. Deprecated Endpoint Cleanup
- **Status:** **Action Required**
- **Analysis:** `POST /api/migration/import_a_model` and its handler `handle_import_a_model` are deprecated and replaced by the batch endpoint `import_models`.
- **Action:** Remove `handle_import_a_model` and its route registration from `backend/server/router.py`. Ensure `_import_pending_model` is effectively utilized or merged into the batch handler.

## 4. Architectural Decoupling
- **Status:** **Low Priority / Future Refactor**
- **Analysis:** While `DatabaseManager` contains business logic, refactoring it now would yield low immediate value compared to feature delivery.
- **Action:** Defer decoupling to a future "Architecture Hardening" track. Mark as technical debt in documentation if necessary.

## 5. Metadata Handling (Pending Models)
- **Status:** **Retain Metadata**
- **Analysis:** For Phase 2 migration (Legacy -> Active), we MUST preserve all original metadata in the `pending_models` table. This ensures no data loss during the transition.
- **Action:** Do NOT implement "strip metadata" logic for pending models. Ensure the migration flow carries over full `meta_json` payload.
