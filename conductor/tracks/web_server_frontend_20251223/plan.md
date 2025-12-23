# Track Plan: Web Server & Frontend Entrypoint

## Phase 1: Backend Server Implementation

- [x] Task: Create Server Module Structure ab05b2b
  - Sub-tasks:
    - [ ] Create `backend/server.py`.
    - [ ] Implement `PortFinder` class to handle "Port + N" logic.
    - [ ] Write tests for port selection.

- [x] Task: Implement aiohttp Server Logic 7ebcec6
  - Sub-tasks:
    - [ ] Implement `HikazeServer` class (inherits `threading.Thread`).
    - [ ] Setup `aiohttp.web.Application`.
    - [ ] Add `/api/hello` route.
    - [ ] Add `cors` setup (allow all for now, or restrictive to Comfy origin).
    - [ ] Implement `run()` loop and `stop()` method.
    - [ ] Write tests: Start server, fetch health endpoint, stop server.

- [ ] Task: Implement Standalone Entrypoint
  - Sub-tasks:
    - [ ] Add `if __name__ == "__main__":` block to `backend/server.py` to allow independent execution.

- [ ] Task: Conductor - User Manual Verification 'Backend Server Implementation' (Protocol in workflow.md)

## Phase 2: Frontend Scaffold & Basic UI

- [ ] Task: Scaffold Vue Project
  - Sub-tasks:
    - [ ] Initialize `model_manager_frontend` using `npm create vite@latest` (via shell commands).
    - [ ] Configure `vite.config.ts` for output dir `dist`.
    - [ ] Install dependencies (Vue, TS, etc.).

- [ ] Task: Implement Core Layout Components
  - Sub-tasks:
    - [ ] Create `HikazeManagerLayout.vue`.
    - [ ] Create placeholder `ModelLibrary.vue` and `ModelDetails.vue`.
    - [ ] Implement 3-pane CSS grid layout (matching `product-guidelines.md`).

- [ ] Task: Implement Embedded Mode Logic
  - Sub-tasks:
    - [ ] Add `embedded` prop to Layout.
    - [ ] Implement conditional rendering for Header/Tabs based on prop.
    - [ ] Write unit test for `HikazeManagerLayout.vue`.

- [ ] Task: Connect Frontend Build to Backend
  - Sub-tasks:
    - [ ] Update `backend/server.py` to serve static files from `model_manager_frontend/dist`.
    - [ ] Add a root route `/` returning `index.html`.

- [ ] Task: Conductor - User Manual Verification 'Frontend Scaffold & Basic UI' (Protocol in workflow.md)

## Phase 3: ComfyUI Integration Hook

- [ ] Task: Update Initialization Logic
  - Sub-tasks:
    - [ ] Modify `__init__.py`.
    - [ ] Add logic to inspect ComfyUI args (for port).
    - [ ] Instantiate and start `DatabaseManager`, `MigrationManager` (resume check), and `HikazeServer`.
    - [ ] Ensure clean shutdown on ComfyUI exit (atexit or similar).

- [ ] Task: Conductor - User Manual Verification 'ComfyUI Integration Hook' (Protocol in workflow.md)
