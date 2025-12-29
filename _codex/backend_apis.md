# Backend APIs

- `u` means not implemented

## GET /api/hello

- desc: greeting
- request: none
- response: `{"status":"ok"}`

## GET /api/images/{hash}.webp

- desc: get active sample image by base name or hash + seq. **Primary method for fetching model visuals.**
- request: query `quality=high|medium|low`, optional `seq=N` (defaults to 0)
- response: webp file or 404

## GET /api/images/get_img_num

- desc: get count of sample images for a model (sha256). **Used to initialize sequential cycling.**
- request: query `sha256=...`
- response: `{"count": n}`

## DELETE /api/images/delete

- desc: delete a specific image sequence and shift subsequent images down (maintaining sequence integrity).
- request: query `sha256=...`, `seq=N`
- response: `{"status": "success"}` or error

## POST /api/images/get_sample_imgs

- desc: **DEPRECATED**. Use `get_img_num` + direct WebP sequence access.
- request: json body {"sha256":"...","quality":"high|medium|low"}
- response: `{"images":["/api/images/..."],"quality":"high","count":n}`

## POST /api/migration/import_a_model

- desc: **DEPRECATED**. Removed in favor of `import_models`.
- request: json body `{"id":123,"conflict_strategy":"override|merge|ignore|delete"|null}`
- response: `{"status":"success|conflict|ignored|deleted|error",...,"deprecated":true}`

## POST /api/migration/import_models

- desc: batch pending import. Promotes records from `pending_import` to `models`.
- request: json body `{"id":[1,2,3],"conflict_strategy":"override|merge|ignore|delete"|null}`
- response: `{"total":n,"success":[...],"conflict":[...],"ignored":[...],"deleted":[...],"failed":[...]}` (207)

## GET /api/models

- desc: list models by type. 
- request: query `type=...` (required). If `type=others`, returns models with unknown/NULL types.
- response: `{"models":[{"sha256":"...","name":"...","type":"...","path":"...","tags":[...]}]}`

## GET /api/models/{sha256}

- desc: get full model record (including meta_json) for right panel
- request: none
- response: `{"sha256":"...", "name":"...", "meta_json":"...", "tags":[{"id":1,"name":"..."}], ...}`

## PATCH /api/models/{sha256}

- desc: update editable model fields and tag associations
- request: json body `{"name":"...","type":"...","tags":[id1, id2],"meta_json":"..."}`
- response: `{<updated_model_object>}` or error

## GET /api/tags

- desc: list all tags in the system
- request: none
- response: `{"tags":[{"id":1,"name":"..."}]}`

## POST /api/tags_add

- desc: batch create/resolve tags by name
- request: json body `{"newtags": ["tag1", "tag2"]}`
- response: `{"tags": [{"id":1, "name":"tag1"}, ...]}`

## u POST /api/models/scan

- desc: scan model dirs and add missing records into pending_import
- request: json body `{}` or `{"type":"..."}`
- response: `{"status":"success","scanned":n,"pending_added":n,"skipped":n,"pending_ids":[...]}`