# Specification - Model Details Implementation and Layout Refactor (2025-12-30)

## Overview
This track implements key frontend enhancements for the Model Details pane in `model_manager_frontend`, addressing feedback from the comprehensive audit. The focus is on resuming interrupted development, realigning the details form with the `meta_json` schema, and implementing a resizable, dynamic layout for the details sidebar.

## Functional Requirements
- **Model Details Form Redesign:**
    - Remove the hardcoded "Model Type" selector (types are determined by the backend during import/scan and are read-only here).
    - Implement a new form structure based on `meta_json_example.json` to handle extended metadata.
    - Fields to implement:
        - `description` (TextArea, optional)
        - `community_links` (TextArea or Input, optional)
        - `prompts.positive` (TextArea, optional)
        - `prompts.negative` (TextArea, optional)
    - Existing fields to retain/refine:
        - `Display Name` (Editable)
        - `Physical Path` (Read-only)
        - `SHA256` (Read-only, remove "Calculate Hash" button/logic per audit feedback)
        - `Tags` (Input component)
- **Resizable Sidebar:**
    - Convert the right-side "Model Details" pane to be resizable.
    - **Default Width:** 24% of the viewport width.
    - **Interaction:** Users can drag a separator handle between the library grid and the details pane to adjust width.
    - **Persistence:** Session-only (reset to 24% on reload/refresh).
- **Frontend/Backend Wiring:**
    - Ensure `deleteImage` is correctly exposed via floating buttons on gallery images in the details pane.
    - Verify `fetchImageCount` integration for image cycling.

## Non-Functional Requirements
- **Responsive Design:** The layout must handle resizing gracefully, ensuring the library grid adjusts its columns/layout as the sidebar grows or shrinks.
- **Code Quality:** Ensure all new TS code passes `npm run build` verification.

## Acceptance Criteria
- [ ] The "Model Type" dropdown is removed from `ModelDetails.vue`.
- [ ] The Model Details form correctly displays and saves `description`, `community_links`, `positive_prompt`, and `negative_prompt` into the `meta_json` structure.
- [ ] The "Calculate Hash" button is removed.
- [ ] The right sidebar width defaults to 24% and can be resized via a drag handle.
- [ ] The sidebar width resets to 24% on page reload.
- [ ] Image deletion works correctly from the details gallery view.

## Out of Scope
- Backend schema changes (schema is assumed stable).
- Model scanning or import logic (reserved for future tracks).
- Persistent storage of UI layout preferences.
