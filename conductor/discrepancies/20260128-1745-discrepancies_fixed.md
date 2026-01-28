# Discrepancy Report: Codex Migration 20260128

**Date:** 2026-01-28
**Author:** AI Agent
**Track:** codex_migration_20260128

## 1. Product Features vs. Implementation

### 1.1 Model Auto-Discovery (Scan)
- **Status:** Partially Implemented
- **Description:** 
    - The backend `backend/server/migration_handler.py` implements `handle_scan_models` (`GET /api/scan`).
    - The frontend `ModelLibrary.vue` and `PendingModelLibrary.vue` do **not** have a button or trigger to initiate this scan.
- **Impact:** Users cannot easily trigger a scan for new models from the UI.
- **Recommendation:** Add a "Scan" button to the `PendingModelLibrary.vue` toolbar.

### 1.2 Conflict Resolution UI
- **Status:** Resolved / Working as Intended (Browser Dialogs)
- **Description:** 
    - Initial audit flagged a missing "dedicated UI" for conflicts.
    - **User Confirmation:** This functionality is currently handled via native browser dialogs (alerts/confirms) during the import process. This is acceptable for the current stage.
- **Recommendation:** None. Current implementation is accepted.

### 1.3 LoRA List Management
- **Status:** Architecture Confirmed / No Discrepancy
- **Description:** 
    - `nodes/lora_power_loader.py` accepts a `hikaze_payload` input containing a JSON string of LoRA configurations.
    - `web/custom_node_frontend/src/components/HikazeLoraPowerLoaderOverlay.vue` provides the UI to visualize and edit this list.
    - The `openManager` modal is used to pick new LoRAs, which returns a structured JSON object that the overlay commits to the payload.
    - **Analysis:** The "LoRA List" is strictly a data protocol (`LoRAListDocument`) exchanged via the `hikaze_payload` widget. There is no need for a separate, global "LoRA Manager" page beyond the existing Model Manager (which handles the *selection* part).
- **Recommendation:** Ensure documentation reflects that "LoRA List Management" is a feature of the **Power Loader Node Overlay**, not a standalone global page.

## 2. API & Architecture

### 2.1 API Contract Matches
- The `api-contracts.md` file is largely accurate with the implementation in `backend/server/router.py`.

## 3. Conclusion
The codebase is largely aligned with the `product.md` vision. The primary actionable item is the missing "Scan" button (1.1). Other items are clarified or accepted as-is.
