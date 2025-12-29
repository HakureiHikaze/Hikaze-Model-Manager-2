# Backend APIs

- `u` means not implemented

## GET /api/hello

- desc: greeting
- request: none
- response: `{"status":"ok"}`

## GET /api/images/{hash}.webp

- desc: get active sample image by base name or hash + seq
- request: query `quality=high|medium|low`, optional `seq=N`
- response: webp file or 404

## GET /api/images/get_img_num

- desc: get count of sample images for a model
- request: query `sha256=...`
- response: `{"count": n}`

## DELETE /api/images/delete

- desc: delete a specific image sequence and shift subsequent images
- request: query `sha256=...`, `seq=N`
- response: `{"status": "success"}` or error

## GET /api/images/pending/{name}.webp

- desc: get pending sample image by file name
- request: query quality=high|medium|low
- response: webp file or 404

## POST /api/images/upload

- desc: upload an image and generate thumbnails with seq
- request: multipart/form-data, fields: image(file), sha256(text)
- response: `{"status":"success","base_name":"<sha256>_<seq>"}` or error

## POST /api/images/get_sample_imgs

- desc: list sample image urls for a model
- request: json body {"sha256":"...","quality":"high|medium|low"}
- response: `{"images":["/api/images/..."],"quality":"high","count":n}`

## GET /api/migration/pending_models

- desc: list pending models in staging
- request: none
- response: `{"models":[{...}]}`

## POST /api/migration/migrate_legacy_db

- desc: stage1 legacy db + images migration
- request: json body `{"legacy_db_path":"...","legacy_images_dir":"..."}`
- response: `{"status":"success|failed","db_migration":{...},"image_migration":{...}}`

## POST /api/migration/import_a_model

- desc: deprecated single pending import
- request: json body `{"id":123,"conflict_strategy":"override|merge|ignore|delete"|null}`
- response: `{"status":"success|conflict|ignored|deleted|error",...,"deprecated":true}`

## POST /api/migration/import_models

- desc: batch pending import
- request: json body `{"id":[1,2,3],"conflict_strategy":"override|merge|ignore|delete"|null}`
- response: `{"total":n,"success":[...],"conflict":[...],"ignored":[...],"deleted":[...],"failed":[...]}` (207)

## GET /api/models/get_types

- desc: list model types for top tabs
- request: none
- response: `{"types":["checkpoints","lora",...]}`

## GET /api/models

- desc: list models by type (simplified for library view)
- request: query `type=...` (required)
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