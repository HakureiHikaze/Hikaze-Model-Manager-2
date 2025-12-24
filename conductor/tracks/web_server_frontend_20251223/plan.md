# Track Plan: Web Server & Frontend Entrypoint

## Phase 1: Backend Server Implementation

- [x] Task: Create Server Module Structure ab05b2b
  - Sub-tasks:
    - [ ] Create `backend/server.py`.
    - [ ] Implement `PortFinder` class to handle "Port + N" logic.

- [x] Task: Implement aiohttp Server Logic 7ebcec6
  - Sub-tasks:
    - [ ] Implement `HikazeServer` class (inherits `threading.Thread`).
    - [ ] Setup `aiohttp.web.Application`.
    - [ ] Add `/api/hello` route.
    - [ ] Add `cors` setup (allow all for now, or restrictive to Comfy origin).
    - [ ] Implement `run()` loop and `stop()` method.

- [x] Task: Implement Standalone Entrypoint 7dce7ce
  - Sub-tasks:
    - [ ] Add `if __name__ == "__main__":` block to `backend/server.py` to allow independent execution.

- [ ] Task: Conductor - User Manual Verification 'Backend Server Implementation' (Protocol in workflow.md)

## Phase 2: Frontend Scaffold & Basic UI [checkpoint: 30cfabf]

- [x] Task: Scaffold Vue Project
  - Sub-tasks:
    - [x] Initialize `model_manager_frontend` using `npm create vite@latest` (via shell commands).
    - [x] Configure `vite.config.ts` for output dir `dist`.
    - [x] Install dependencies (Vue, TS, etc.).

- [x] Task: Implement Core Layout Components
  - Sub-tasks:
    - [x] Create `HikazeManagerLayout.vue`.
    - [x] Create placeholder `ModelLibrary.vue` and `ModelDetails.vue`.
    - [x] Implement 3-pane CSS grid layout (matching `product-guidelines.md`).

- [x] Task: Implement Embedded Mode Logic
  - Sub-tasks:
    - [x] Add `embedded` prop to Layout.
    - [x] Implement conditional rendering for Header/Tabs based on prop.

- [x] Task: Connect Frontend Build to Backend
  - Sub-tasks:
    - [x] Update `backend/server.py` to serve static files from `model_manager_frontend/dist`.
    - [x] Add a root route `/` returning `index.html`.

- [x] Task: Conductor - User Manual Verification 'Frontend Scaffold & Basic UI' (Protocol in workflow.md) 30cfabf

## Phase 3: ComfyUI Integration Hook

- [x] Task: Update Initialization Logic b5466af
  - Sub-tasks:
    - [x] Modify `__init__.py`.
    - [x] Add logic to inspect ComfyUI args (for port).
    - [x] Instantiate and start `DatabaseManager`, `MigrationManager` (resume check), and `HikazeServer`.
    - [x] Ensure clean shutdown on ComfyUI exit (atexit or similar).

- [ ] Task: Conductor - User Manual Verification 'ComfyUI Integration Hook' (Protocol in workflow.md)
