# Specification: Model Scan Integration

## 1. Overview
This track adds a "Scan" button to both the standalone Model Manager and the node-triggered fullscreen modal. This button allows users to manually trigger a server-side scan of model directories to discover new files.

## 2. Functional Requirements

### 2.1 "Scan" Button Interaction
*   **Trigger:** Add a text-labeled button "Scan" to:
    *   `App.vue` (Standalone): Inside the `FloatingToolbar`, to the left of the "Pending" button.
    *   `HikazeManagerModal.vue` (Embedded): Inside the modal toolbar, to the left of the "Pending" button.
*   **Workflow:**
    1.  User clicks "Scan".
    2.  Display a browser confirmation dialog: "Scan model directories for new files? This might take a moment."
    3.  If confirmed:
        *   Transition the button to a **Loading State** (disabled, with a spinner or "Scanning..." text).
        *   Send a `GET` request to `/api/scan`.
    4.  Upon completion:
        *   Display a toast notification with the result (e.g., "Scan complete: X new models found" or "Error during scan").
        *   Refresh the model/pending lists automatically.
        *   Restore the button to its original state.

### 2.2 API Integration
*   Use the existing backend endpoint: `GET /api/scan`.
*   Handle success and error responses gracefully.

## 3. UI/UX Requirements
*   **Label:** The button must display the text `Scan`.
*   **Positioning:** Must be consistently placed to the immediate left of the "Pending" button in both interfaces.
*   **Feedback:** Use standard project components for loading states and toast notifications where possible.

## 4. Acceptance Criteria
*   [ ] "Scan" button appears in the Standalone floating toolbar.
*   [ ] "Scan" button appears in the Fullscreen Modal toolbar.
*   [ ] Clicking "Scan" shows a confirmation dialog.
*   [ ] Successfully calling the API updates the pending/model counts and shows a result toast.
*   [ ] Button is disabled and shows loading feedback during the scan.
