# Specification - Floating Function Panel & Pending Models API

## Overview
This track introduces a persistent, draggable "Floating Function Panel" to the Hikaze Model Manager. This panel serves as a global control hub that overlays the main manager interface (specifically within the manager modal). It is designed to be context-aware, allowing different views or tabs to inject custom buttons and event handlers while maintaining a consistent "Pending Models" indicator.

Additionally, this track includes the backend API implementation required to support the "Pending Models" count badge and data retrieval.

## Functional Requirements

### 1. Floating Function Panel Component (`HikazeFloatingPanel.vue`)
- **Global Presence:** The panel initializes with the parent manager modal and persists across tab switches.
- **Draggable UI:**
  - Users can drag the panel anywhere within the boundaries of the Manager Modal.
  - The panel must handle mouse events to prevent dragging when clicking interactive child elements (buttons).
  - **State Persistence:** The panel's position is preserved during the current session (reset on page reload is acceptable for this iteration, unless local storage persistence is strictly required now).
- **Dynamic Content API:**
  - The component must expose a method or slot mechanism to allow the current active view (e.g., Library, Migration) to inject custom buttons.
  - **Standard Interface:** `addButton(id, label, icon, callback, style)` and `removeButton(id)` or similar reactivity.
  - **Default Actions:** Support for standard 'Confirm' and 'Exit' actions where applicable.

### 2. Pending Models Integration
- **Count Badge:**
  - The panel displays a dedicated "Pending Models" icon/button with a numeric badge.
  - **Data Source:** The count is fetched from the backend API on initialization and refreshed appropriately (e.g., after migration actions).
- **Interactivity:** Clicking the pending models button should trigger a specific action (e.g., navigating to the Migration tab or opening a pending list modal - *to be wired up by the parent*).

### 3. Backend API (Migration/Pending Models)
Implement the following endpoints in `backend/server/router.py` (or dedicated controller):

- **GET `/api/migration/get_pending_count`**
  - **Response:** `{"count": <integer>}`
  - **Logic:** efficient query to count records in the staging/pending table.

- **GET `/api/migration/get_pending_models`**
  - **Query Params:** `type` (optional filter)
  - **Response:** `{"models": [{"id": "legacy_id", "path": "..."}]}`
  - **Logic:** List brief details of pending models. **Note:** The record shape matches the existing `pending_import` definition.

- **GET `/api/migration/get_pending_model`**
  - **Query Params:** `id` (required)
  - **Response:** `{"id": "...", "path": "...", "tags": [], ...}` (Full record)
  - **Logic:** Fetch full details for a specific pending item. **Note:** The record shape matches the existing `pending_import` definition.

## Non-Functional Requirements
- **Z-Index Management:** Ensure the floating panel always stays on top of the library grid and detail panes but below global alerts/modals.
- **Performance:** Dragging must be smooth (60fps). API count queries should be optimized to not slow down manager initialization.
- **Style:** Consistent with the "GitHub Dark" theme (`#0d1117`, `#21262d` borders).

## Acceptance Criteria
- [ ] Backend: `GET /api/migration/get_pending_count` returns the correct integer.
- [ ] Backend: `GET /api/migration/get_pending_models` returns the list of pending items (matching `pending_import` schema).
- [ ] Backend: `GET /api/migration/get_pending_model` returns full details for a single item (matching `pending_import` schema).
- [ ] Frontend: `HikazeFloatingPanel.vue` renders inside the Manager Modal.
- [ ] Frontend: The panel can be dragged around but stays within the modal boundaries.
- [ ] Frontend: The "Pending Models" badge displays the count fetched from the API.
- [ ] Frontend: Different tabs can successfully inject unique buttons into the panel.
- [ ] Frontend: Position persists when switching between Library and other tabs.

## Out of Scope
- Full implementation of the "Migration Interface" (the view that appears when you click the pending models button).
- The "Stage 2 Migration" logic (promoting/merging models from pending to active). This track is strictly for **viewing** the pending state and the panel UI.
- Complex local storage persistence for panel position (session persistence via Vue state is sufficient).
