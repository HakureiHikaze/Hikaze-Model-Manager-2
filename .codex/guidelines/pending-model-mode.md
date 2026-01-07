# Pending Model Mode Guidelines

This document captures the UX and data flow for Pending mode in the manager.

## Entry points and badges

- Standalone manager: add a Pending button in the floating toolbar, with a red badge showing pending count.
- Embedded manager: add a Pending button in the modal title bar, with the same badge.
- Badge count derives from pending cache length (`useModelCache('pending')`).
- Hide the badge when the count is zero.

## Mode state and data source

- Introduce a `managerMode` state (`active` | `pending`) in the standalone App and embedded modal.
- When `managerMode === 'pending'`, the library list must use pending cache (`fetchPendingModels`) instead of active cache.
- On mode entry, force refresh pending cache; on import success, refresh pending and invalidate active cache.

Evidence:
- Pending cache and fetch: `web/model_manager_frontend/src/cache/models.ts`
- Pending API: `web/model_manager_frontend/src/api/models.ts`

## Pending list rendering

- Pending records are `PendingModelSimpleRecord` (id, name, image, type, tags).
- List preview uses `/api/images/pending/{name}` from the `image` field (basename only).
- Details preview uses `GET /api/images/pending/{id}` for the original image size.
- No image carousel for pending; static preview only.

Evidence:
- Pending type/adapter: `web/shared/types/model_record.ts`, `web/shared/adapters/models.ts`
- Pending image endpoint: `backend/server/images_handler.py`, `backend/server/router.py`

## Selection behavior

- Checkboxes visible for pending cards and list rows.
- Selection is toggled by checkbox only; card click updates details view.
- Search and tag filters remain available in Pending mode.

## Pending details panel

- Details panel fetches read-only data from `GET /api/migration/pending_model?id=<id>`.
- Response is `PendingModelRecord`; the form is non-editable.
- Details image preview uses `GET /api/images/pending/{id}`.
- If no image is available, show a 3:4 placeholder in the preview frame.

## Bulk import action

- Bulk import button is available in the floating toolbar (standalone) and title bar (embedded).
- Button is disabled if no pending items are selected.
- Initial action calls `POST /api/migration/import_models` with `id` list and `conflict_strategy: null`.
- If `conflict.length > 0`, show a conflict list (pending vs existing) and prompt the user for a strategy (`override`, `merge`, `ignore`, `delete`), then re-submit only the conflict items.
- On success, refresh pending list and invalidate active cache.
- On error, show user-facing error feedback.

Evidence:
- Import API handler: `backend/server/migration_handler.py`
- Import response shape: `web/shared/types/api.ts`

## Visual identity

- Pending mode uses an amber accent for mode indicators and button emphasis.
- Apply a root `.is-pending` class (or equivalent) to switch the accent palette.
