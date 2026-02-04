# Specification: UI Refactor - Fullscreen Modal & Global Entry

## 1. Overview
This track refactors the frontend interaction patterns of Hikaze Model Manager 2. It introduces a global entry point via the ComfyUI context menu, unifies the node-triggered manager into a mandatory fullscreen modal, and provides a technical analysis of the LoRA Power Loader's custom UI implementation.

## 2. Functional Requirements

### 2.1 Global Entry Point
*   **Context Menu Registration:** Register a new menu item "Hikaze Model Manager (HMM)" in the standard ComfyUI right-click context menu (canvas-level).
*   **Behavior:** Clicking this item must:
    1.  Discover the active Hikaze server port.
    2.  Open the standalone manager page in a **new browser tab**.

### 2.2 Mode Unification & Modal Refactor
*   **State Confirmation:** Verify that the manager only exists in two states:
    1.  **Node Embedded:** Triggered via node buttons, currently supporting window/fullscreen modes.
    2.  **Standalone:** Full-page independent browser tab.
*   **Fullscreen Mandatory:** Refactor the node-triggered `HikazeManagerModal`.
    *   **Current:** Opens as a windowed modal by default with a maximize toggle.
    *   **New:** Clicking a selection button on a node (Checkpoint/LoRA) must **immediately open the modal in fullscreen mode**.
    *   The "Restore Window" toggle should be removed or disabled, ensuring a consistent immersive experience.

### 2.3 LoRA Power Loader Analysis
*   Perform a deep-dive analysis of how the LoRA Power Loader manages its list-based UI within the node overlay.
*   The analysis must cover:
    *   Data synchronization between the Vue component and the `hikaze_payload` widget.
    *   How the "multi-select" mode of the manager is triggered and how results are merged.
*   Deliver the analysis as a summary report in the final implementation response.

## 3. Technical Requirements
*   **ComfyUI Hooking:** Use the standard `app.canvas.getCanvasMenuOptions` or similar extension hook for context menu injection.
*   **CSS/Refactor:** Update `HikazeManagerModal.vue` and related store/service logic to default `isFullscreen` to `true` and remove windowed constraints.

## 4. Acceptance Criteria
*   [ ] "HMM" appears in the ComfyUI right-click menu and opens the standalone page in a new tab.
*   [ ] Node buttons open the Model Manager modal directly in fullscreen mode.
*   [ ] The windowed mode for the node-triggered modal is removed.
*   [ ] Analysis report for LoRA Power Loader is provided.