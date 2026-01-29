# API Contracts

Record authoritative API contracts here. Do not infer schemas; derive them from handlers.
When an endpoint changes, update this file and reference the source handler.

## Manager API (backend server)

Source: `backend/server/router.py` and handler modules.

- `GET /api/models/get_types` -> `backend/server/library_info_handler.py`
- `GET /api/models/{sha256}` -> `backend/server/library_info_handler.py`
- `PATCH /api/models/{sha256}` -> `backend/server/library_info_handler.py`
- `GET /api/models` -> `backend/server/library_info_handler.py`
- `GET /api/tags` -> `backend/server/library_info_handler.py`
- `POST /api/tags_add` -> `backend/server/library_info_handler.py`
- `GET /api/images/get_img_count` -> `backend/server/images_handler.py`
- `GET /api/images/{hash}` -> `backend/server/images_handler.py`
- `GET /api/images/{hash}.webp` -> `backend/server/images_handler.py`
- `GET /api/images/pending/{name}` -> `backend/server/images_handler.py`
- `GET /api/images/pending/{name}.webp` -> `backend/server/images_handler.py`
- `POST /api/images/upload` -> `backend/server/images_handler.py`
- `DELETE /api/images/delete` -> `backend/server/images_handler.py`
- `GET /api/migration/pending_models` -> `backend/server/migration_handler.py`
- `POST /api/migration/migrate_legacy_db` -> `backend/server/migration_handler.py`
- `POST /api/migration/import_models` -> `backend/server/migration_handler.py`
- `GET /api/scan` -> `backend/server/migration_handler.py`

### GET /api/migration/pending_models
- Handler: `backend/server/migration_handler.py`
- Response: `{ "models": PendingModelSimpleRecord[] }`
  - `PendingModelSimpleRecord`: `{ id: number, name: string, image: string, type: string, tags: Tag[] }`
- Errors: `500` with `{ "error": string }`

### GET /api/migration/pending_model?id=<id>
- Handler: `backend/server/migration_handler.py`
- Response: `PendingModelRecord`
- Errors: `400` for missing/invalid id, `404` if not found, `500` on server error

### POST /api/migration/import_models
- Handler: `backend/server/migration_handler.py`
- Request: `{ "id": number[], "conflict_strategy": "override" | "merge" | "ignore" | "delete" | null }`
- Response (`207`): `BatchPromotionReport`
  - `total`, `success`, `conflict`, `ignored`, `deleted`, `failed`
- Errors: `400` for invalid JSON or empty `id` array

### GET /api/scan
- Handler: `backend/server/migration_handler.py`
- Response: `{ "status": "success", "scanned": number, "added": number, "pending_ids": number[], "skipped": number }`
- Errors: `503` when model type cache is empty, `500` on server error

### GET /api/images/pending/{name}.webp
- Handler: `backend/server/images_handler.py`
- Response: WebP image bytes
- Errors: `404` if image not found

### GET /api/images/pending/{id}
- Handler: `backend/server/images_handler.py`
- Response: original image bytes for the pending model
- Notes: filename is sourced from `pending_import` and resolved under `data/pending`
- Errors: `400` for invalid id, `404` if image not found

For each endpoint above, add:

```
### <METHOD> <PATH>
- Handler: <file>
- Request: <query/body schema>
- Response: <status + payload schema>
- Errors: <status + conditions>
```

## ComfyUI-side integration

Source: `backend/server/instance.py`, `backend/server/router.py`, and `.codex/guidelines/integration-guidelines.md`.

- ComfyUI route for port discovery: `/api/hikaze/sniffer_port` (register in ComfyUI).
- Frontend must call the ComfyUI route to obtain the Hikaze server port.
