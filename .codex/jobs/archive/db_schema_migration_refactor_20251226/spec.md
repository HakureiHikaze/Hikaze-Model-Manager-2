# Track Specification: Database Schema and Migration Refactor

## Overview
Refactor the database schema and migration flow to support legacy imports, a
pending staging queue with tag preservation, and explicit conflict handling.
Introduce a dual-handle database manager with lazy, read-only legacy access.

## Goals
- Normalize the new schema around sha256 identity.
- Preserve legacy tags and pending relationships by legacy ids.
- Provide pending model UX and APIs for batch and single imports.
- Enforce legacy DB read-only access with clear error propagation.

## Database Schema

### models
- sha256 (PK)
- path
- name
- type
- size_bytes
- created_at
- meta_json (migrated from legacy extra_json only)

### tags
- id (PK, legacy ids preserved; auto-increment continues)
- name

### model_tags
- model_hash (FK -> models.sha256)
- tag_id (FK -> tags.id)

### pending_import
- id (PK = legacy model_id; may be named legacy_model_id)
- path (UNIQUE index; not the primary key)
- sha256 (NULL placeholder; no caching)
- name
- type
- size_bytes
- created_at
- meta_json
- Read-only except delete.

### pending_model_tags
- model_id (FK -> pending_import.id)
- tag_id (FK -> tags.id)
- Read-only except delete.

### db_meta (k/v)
- key (PK)
- value (TEXT)
- db_version = 2
- tags_id_max = current maximum tag id

## Database Manager
- DatabaseManager holds primary and legacy handles.
- Legacy handle is lazy-loaded and read-only (SQLite mode=ro).
- Missing legacy path during import/migration raises an error and logs details;
  API returns 502 with the same details.
- Provide a LegacyDatabaseReader for explicit read-only access.

## Migration Flow
- One-pass routing: legacy records -> models or pending_import.
- Legacy tags copied by id; relationships preserved in model_tags and
  pending_model_tags.
- meta_json is a direct copy of legacy extra_json; legacy meta_json is ignored.
- No duplicate sha256 entries in models.
- pending_import.path unique conflicts log full records and are skipped.

## APIs
- GET /api/migration/pending_models
- POST /api/migration/import_pending_models (ids[])
- POST /api/migration/import_a_pending_model (id, optional strategy)
  - strategy: overwrite | skip | merge
  - If strategy missing and conflict occurs, return a special response for
    user decision.
- Conflict responses include full records from both sides and a reason.

## Frontend
- Add a Pending tab listing pending models.
- Each card/list item has a checkbox.
- Batch import button is disabled until at least one item is selected.
- Conflict decision modal offers overwrite, skip, or merge.

## Non-Functional Requirements
- Legacy DB read-only.
- Pending tables are read-only except delete.
- system_tags renamed to system_types to avoid confusion with DB tags.
