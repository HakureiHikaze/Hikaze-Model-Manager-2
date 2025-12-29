# Plan: Model Data Fetching, Local Caching, and Reactive Previews

## Phase 1: Setup & Backend API Development [checkpoint: 4101590]
- [x] Task: Create and switch to a new development branch `model_lib_dev`. aaa42f7
- [x] Task: Extend `DatabaseManager` in `backend/database/db.py` to support fetching models by type (including 'others' logic) with their associated tags. ffee8aa
- [x] Task: Implement the `handle_get_models` handler in `backend/server/router.py` to expose the `GET /api/models` endpoint. 24cfde0
- [x] Task: Register the `GET /api/models` route in `setup_routes`. 24cfde0
- [x] Task: Refactor `handle_get_models` in `backend/server/router.py` to return simplified model objects (excluding full `meta_json`). df68154
- [x] Task: Conductor - User Manual Verification 'Setup & Backend API Development' (Protocol in workflow.md) df68154

## Phase 2: Frontend Data & Cache Layer [checkpoint: 16f5d1d]
- [x] Task: Update `web/model_manager_frontend/src/api/models.ts` with the `fetchModels` function and necessary TypeScript interfaces. d31df62
- [x] Task: Implement a centralized model store or composable to manage the `cachedModels` (Record<type, Model[]>) and loading states. 5dd99c9
- [x] Task: Update `HikazeManagerLayout.vue` to trigger model fetching (or cache retrieval) whenever the `activeTab` changes. a853e9b
- [x] Task: Conductor - User Manual Verification 'Frontend Data & Cache Layer' (Protocol in workflow.md) 16f5d1d

## Phase 3: Reactive Library & Filtering [checkpoint: 1a334f1]
- [x] Task: Refactor `ModelLibrary.vue` to consume the real model data from the state/cache instead of mock data. dabf77c
- [x] Task: Implement reactive local searching (by name/path) and tag-based filtering within `ModelLibrary.vue`. 05adab4
- [x] Task: Add a "Refresh" button to the library toolbar to manually invalidate the cache and re-fetch the current type. 7c02e4a
- [x] Task: Refine tag filtering logic in `ModelLibrary.vue` to support "AND" logic and tri-state selection (Include/Exclude/None). 686a079
- [x] Task: Conductor - User Manual Verification 'Reactive Library & Filtering' (Protocol in workflow.md) 1a334f1

## Phase 4: Image Preview & Lazy Loading [checkpoint: e7f84d9]
- [x] Task: Implement a lazy-loading mechanism (Intersection Observer) for model card backgrounds in the library. ac05a10
- [x] Task: Update the model card styling to use the `/api/images/{sha256}.webp?quality=medium` endpoint for background images. 9d6ecc5
- [x] Task: Add placeholder handling for models without a recorded preview image. f78584e
- [x] Task: Fix frontend ModelLibrary.vue to correctly implement IntersectionObserver for lazy loading. 4e952c9
- [x] Task: Conductor - User Manual Verification 'Image Preview & Lazy Loading' (Protocol in workflow.md) e7f84d9

## Phase 5: User Requested Enhancements [checkpoint: e7f84d9]
- [x] Task: Extend `DatabaseManager` in `backend/database/db.py` to support `get_all_tags`.
- [x] Task: Implement `handle_get_tags` in `backend/server/router.py` to expose `GET /api/tags`.
- [x] Task: Update `_codex/backend_apis.md` with the new `GET /api/tags` endpoint.
- [x] Task: Update `web/model_manager_frontend/src/api/models.ts` to include `fetchTags`.
- [x] Task: Update `ModelLibrary.vue` to fetch tags on mount and automatically set 'nsfw' tag to 'exclude'.
- [x] Task: Conductor - User Manual Verification 'User Requested Enhancements' (Protocol in workflow.md) e7f84d9
- [ ] Task: Update `ModelLibrary.vue` to fetch tags on mount and automatically set 'nsfw' tag to 'exclude'.
- [ ] Task: Conductor - User Manual Verification 'User Requested Enhancements' (Protocol in workflow.md)
