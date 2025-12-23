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
    *   `src/components/HikazeManagerLayout.vue`: The main shell.
    *   `src/components/ModelLibrary.vue`: Left pane (Grid/List of models).
    *   `src/components/ModelDetails.vue`: Right pane (Metadata).
    *   `src/components/ManagerHeader.vue`: Top bar (Tabs, Search).
*   **Context Mode:**
    *   Accepts a prop/attribute `embedded_mode` (boolean).
    *   If `true` (e.g., opened from a "Load Checkpoint" node), the Category Tabs are hidden, and the view is locked to the specific category passed via prop (e.g., `category="checkpoints"`).
*   **Build:** configuring Vite to output to a specific `dist` folder that the backend server serves.

### 3. Integration Hook (`__init__.py`)
*   **Initialization:**
    *   Initialize `DatabaseManager`.
    *   Start `MigrationManager` (if needed/configured).
    *   Start the `aiohttp` Server Thread.
*   **Configuration:** Read ComfyUI args to determine the base port.

## Testing Strategy
*   **Backend Tests:**
    *   Test port selection logic (mocking socket bind).
    *   Test static file serving (requesting index.html).
    *   Test server start/stop lifecycle.
*   **Frontend Tests:**
    *   Unit tests for Layout components (verifying `embedded_mode` hides tabs).
*   **Integration Tests:**
    *   Verify the server thread starts when `__init__` is mocked.
