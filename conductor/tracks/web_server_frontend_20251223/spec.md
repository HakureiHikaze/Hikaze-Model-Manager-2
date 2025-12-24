# Track Specification: Web Server & Frontend Entrypoint

## Overview
This track implements the dedicated web interface and backend server for the Hikaze Model Manager. It involves creating a standalone `aiohttp` server that runs alongside ComfyUI, serving a modern Vue 3 frontend. This server provides the API for the manager UI and serves the static assets.

## Requirements

### 1. Backend Server (`backend/server.py`)
*   **Framework:** `aiohttp` (Async I/O).
*   **Execution:** Runs as a daemon `threading.Thread` initiated from `__init__.py`.
*   **Port Selection:** Starts scanning at `ComfyUI Port + 1`. If occupied, increments until a free port is found (up to a reasonable limit, e.g., +10).
*   **Static Serving:** Serves the compiled frontend assets from `model_manager_frontend/dist`.
*   **API Stubs:**
    *   `/api/hello`: Returns `{"status": "ok", "port": <port>}` for health checks.
    *   Placeholder for future model management APIs.
*   **Standalone Mode:** Includes `if __name__ == "__main__":` block to run independently for development.

### 2. Frontend Application (`model_manager_frontend/`)
*   **Stack:** Vue 3, Vite, TypeScript.
*   **Structure:**
    *   `src/components/HikazeManagerLayout.vue`: The main shell using a CSS Grid layout (Header + Library Pane + Details Pane).
    *   `src/components/ModelLibrary.vue`: Left pane handling model browsing.
        *   **View Modes:** Toggle between Card Grid and List View.
        *   **Grid Control:** Dynamic column count (2-100) with `align-content: start` to prevent vertical spacing issues.
        *   **Density Strategy:** Hides card titles when columns > 6.
        *   **Tooltips:** Full-width, absolute positioned overlays on cards showing full name and 2-column tag grid.
        *   **Filtering:** Placeholder "Tags Filter" dropdown adjacent to view controls.
    *   `src/components/ModelDetails.vue`: Right pane handling metadata.
        *   **Image Preview:** Hover overlay with "Open New Tab" and "Upload" actions.
        *   **Identity:** Editable "Display Name" vs Read-only "Physical Path".
        *   **Validation:** SHA256 field with background calculation trigger button.
        *   **Metadata:** Base Model selector, Notes textarea.
        *   **Tags/Triggers:** Chip-based input system (Space/Comma delimiter) with hover-delete.
*   **Context Mode:**
    *   Accepts props `embedded` (boolean) and `initialTab` (string).
    *   **Embedded Logic:** If `embedded=true` OR `initialTab` is set, the top-level Category Navigation Bar is hidden.
    *   **Initial Tab:** If `initialTab` is provided, the library defaults to that category.
*   **Build:** configuring Vite to output to a specific `dist` folder (`web/dist/manager`) that the backend server serves.

### 3. Integration Hook (`__init__.py`)
*   **Initialization:**
    *   Initialize `DatabaseManager`.
    *   Start `MigrationManager` (if needed/configured).
    *   Start the `aiohttp` Server Thread.
*   **Configuration:** Read ComfyUI args to determine the base port.
