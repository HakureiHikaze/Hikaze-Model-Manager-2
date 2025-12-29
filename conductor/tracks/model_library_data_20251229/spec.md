# Specification: Model Data Fetching, Local Caching, and Reactive Previews

## Overview
This track implements the core data flow for retrieving model lists from the backend and displaying them in the Manager UI. It adopts a "Client-Side Heavy" architecture where model lists are fetched per category, cached in memory to ensure instant tab switching, and only re-fetched upon manual user request.

## Functional Requirements

### Backend: Model Retrieval API
- **Endpoint:** `GET /api/models`
- **Parameters:** `type` (required). Supports standard types and a special `others` value.
- **"Others" Logic:** If `type=others`, return models where `type` is NULL, empty, or not in the system's recognized folder list.
- **Response Shape:** A JSON array of model objects:
    - `sha256`: Unique ID for identifiers and image lookup.
    - `name`: Display name.
    - `path`: File path.
    - `type`: Category string.
    - `tags`: List of associated tags (names/IDs) for immediate UI rendering and filtering.

### Backend: Tag Retrieval API
- **Endpoint:** `GET /api/tags`
- **Response Shape:** A JSON object containing a list of all tags:
    - `tags`: Array of objects with `id` and `name`.

### Frontend: Data Management & Persistent-Session Cache
- **Tab-Triggered Loading:** On tab selection, check the local cache for that `type`.
    - If **Cache Hit:** Load instantly from memory.
    - If **Cache Miss:** Fetch from backend and store in memory.
- **Manual Refresh:** Provide a "Refresh" mechanism that bypasses the cache to fetch the latest data from the backend.
- **Local Reactive Operations:**
    - **Search:** Instant local filtering by name/path.
    - **Tag Filtering:** Re-ordering and highlighting items based on active tags chosen in the UI.
- **Auto-Exclude NSFW:**
    - On application load, fetch all tags via `/api/tags`.
    - If a tag named "nsfw" (case-insensitive) exists, automatically set its filter state to 'exclude' to hide sensitive content by default.

### Frontend: Image Preview System
- **Lazy Loading:** Use an Intersection Observer (or similar) to load model card backgrounds only when visible.
- **Default Quality:** Default to `medium` quality previews (`/api/images/{sha256}.webp?quality=medium`) for the card backgrounds.
- **Concurrency:** Ensure images are loaded concurrently but managed to prevent UI blocking.

## Non-Functional Requirements
- **Instant Navigation:** Tab switching must be near-zero latency once a category is initially loaded.
- **State Fidelity:** The UI state (scroll position, filters) should ideally be preserved or handled gracefully when switching tabs using the cache.

## Acceptance Criteria
- [ ] `GET /api/models` correctly filters by `type` (including `others`) and returns `sha256`, `name`, `path`, and `tags`.
- [ ] Switching between tabs is instantaneous if the data was previously loaded.
- [ ] A "Refresh" action successfully updates the cache with fresh backend data.
- [ ] Local search and tag filtering work without triggering network requests.
- [ ] Card images load with `medium` quality as they enter the viewport.

## Out of Scope
- Server-side pagination.
- Browser persistent storage (IndexedDB). Cache is cleared on page refresh.
- Implementation of the "Details" sidebar content.
