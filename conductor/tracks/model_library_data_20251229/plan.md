# Plan: Model Data Fetching, Local Caching, and Reactive Previews

## Phase 1: Setup & Backend API Development
- [x] Task: Create and switch to a new development branch `model_lib_dev`. aaa42f7
- [ ] Task: Extend `DatabaseManager` in `backend/database/db.py` to support fetching models by type (including 'others' logic) with their associated tags.
- [ ] Task: Implement the `handle_get_models` handler in `backend/server/router.py` to expose the `GET /api/models` endpoint.
- [ ] Task: Register the `GET /api/models` route in `setup_routes`.
- [ ] Task: Conductor - User Manual Verification 'Setup & Backend API Development' (Protocol in workflow.md)

## Phase 2: Frontend Data & Cache Layer
- [ ] Task: Update `web/model_manager_frontend/src/api/models.ts` with the `fetchModels` function and necessary TypeScript interfaces.
- [ ] Task: Implement a centralized model store or composable to manage the `cachedModels` (Record<type, Model[]>) and loading states.
- [ ] Task: Update `HikazeManagerLayout.vue` to trigger model fetching (or cache retrieval) whenever the `activeTab` changes.
- [ ] Task: Conductor - User Manual Verification 'Frontend Data & Cache Layer' (Protocol in workflow.md)

## Phase 3: Reactive Library & Filtering
- [ ] Task: Refactor `ModelLibrary.vue` to consume the real model data from the state/cache instead of mock data.
- [ ] Task: Implement reactive local searching (by name/path) and tag-based filtering within `ModelLibrary.vue`.
- [ ] Task: Add a "Refresh" button to the library toolbar to manually invalidate the cache and re-fetch the current type.
- [ ] Task: Conductor - User Manual Verification 'Reactive Library & Filtering' (Protocol in workflow.md)

## Phase 4: Image Preview & Lazy Loading
- [ ] Task: Implement a lazy-loading mechanism (Intersection Observer) for model card backgrounds in the library.
- [ ] Task: Update the model card styling to use the `/api/images/{sha256}.webp?quality=medium` endpoint for background images.
- [ ] Task: Add placeholder handling for models without a recorded preview image.
- [ ] Task: Conductor - User Manual Verification 'Image Preview & Lazy Loading' (Protocol in workflow.md)
