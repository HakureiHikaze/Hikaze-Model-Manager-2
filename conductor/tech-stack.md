# Tech Stack - Hikaze Model Manager 2

## Backend
- **Language:** Python (>= 3.10)
- **Framework:** ComfyUI Custom Node API (V3/V2 hybrid)
- **Data Persistence:** SQLite (planned for SHA256-based model indexing and legacy migration).
- **Schema Management:** Versioned JSON schemas for node-to-backend communication.

## Frontend
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript (Strict mode)
- **Build Tool:** Vite
- **State Management:** Vue Composition API (Reactive/Ref) for local state; potential Pinia if global state complexity increases.
- **Styling:** CSS3 (Standard) with a focus on CSS variables for theme consistency.
- **Integration:** Custom Vue overlays injected via ComfyUI's frontend extension system (VueNodes).

## Tooling & Workflow
- **Linting & Formatting:** `vue-tsc` for type checking, `TypeScript` for source.
- **Build Output:** Single-bundle JavaScript emitted to `web/dist` as defined in `pyproject.toml`.
- **Environment:** Node.js for frontend development/build; Python environment for backend execution.
