# Backend APIs

- `u`means not implemented

## GET /api/hello

- desc: greeting
- request: none
- response: `{"status":"ok"}`

## GET /api/images/{hash}.webp

- desc: get active sample image by base name
- request: query quality=high|medium|low
- response: webp file or 404

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

## u GET /api/models/types

- desc: list model types for top tabs
- request: none
- response: `{"types":["checkpoint","lora",...]}`

## u GET /api/models

- desc: list models for left library with filters
- request: query `type=...&q=...&tags=1,2&exclude_tags=3,4&limit=...&offset=...`
- response: `{"total":n,"models":[{"sha256":"...","name":"...","type":"...","preview_base":"...","tag_ids":[...]}]}`

## u GET /api/models/{sha256}

- desc: get model detail for right panel
- request: none
- response: `{"model":{...,"tags":[{"id":1,"name":"..."}]}}`

## u PATCH /api/models/{sha256}

- desc: update editable model fields
- request: json body `{"name":"...","meta_json":{...},"tag_ids":[...]}`
- response: `{"status":"success"}` or error

## u GET /api/tags

- desc: list tags for filter/select
- request: query `type=...` (optional)
- response: `{"tags":[{"id":1,"name":"...","count":n}]}`

## u POST /api/models/scan

- desc: scan model dirs and add missing records into pending_import
- request: json body `{}` or `{"type":"..."}`
- response: `{"status":"success","scanned":n,"pending_added":n,"skipped":n,"pending_ids":[...]}`
