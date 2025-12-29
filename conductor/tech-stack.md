# Tech Stack - Hikaze Model Manager 2

## Backend
- **Language:** Python (>= 3.10)
- **Framework:** ComfyUI Custom Node API (V3/V2 hybrid) + **aiohttp** (Dedicated Manager Server)
- **ComfyUI Integration:** `folder_paths` for path resolution, `comfy.sd` and `comfy.utils` for model operations.
- **Data Persistence:** SQLite (SHA256-based indexing, legacy migration staging, and versioned metadata via `db_meta`).
- **Schema Management:** Versioned JSON schemas for node-to-backend communication.

## Frontend
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript (Strict mode)
- **Build Tool:** Vite
- **Libraries:** Vue Use (planned), standard DOM APIs (including Intersection Observer).
- **State Management:** Vue Composition API (Reactive/Ref) for local state; potential Pinia if global state complexity increases.
- **Styling:** CSS3 (Standard) with a focus on CSS variables for theme consistency.
- **Integration:** Custom Vue overlays injected via ComfyUI's frontend extension system (VueNodes).

## Tooling & Workflow
- **Linting & Formatting:** `vue-tsc` for type checking, `TypeScript` for source.
- **Build Output:** Single-bundle JavaScript emitted to `web/dist` as defined in `pyproject.toml`.
- **Environment:** Node.js for frontend development/build; Python environment for backend execution.
