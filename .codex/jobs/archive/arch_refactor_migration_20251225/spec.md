# Track Specification: Architecture Refactor & Legacy Migration

## Overview
This track executes a major architectural refactor of the backend, implements a robust image processing pipeline, and establishes a comprehensive migration system (including "Reactive Migration") for legacy data.

## 1. Architectural Refactoring
**Goal:** Modularize the backend for better maintainability.

### Structural Changes
*   **Database:**
    *   Create package `backend/database/`.
    *   Move `backend/database.py` -> `backend/database/db.py`.
    *   Move `backend/migration/` -> `backend/database/migration/`.
*   **Utilities:**
    *   Create package `backend/util/`.
    *   Move `backend/config.py` -> `backend/util/config.py`.
*   **Server:**
    *   Create package `backend/server/`.
    *   Move `backend/server.py` -> `backend/server/instance.py` (Server Class).
    *   Create `backend/server/router.py` (API Routes).

## 2. Image Infrastructure
**Module:** `backend/util/image_processor.py` (New)
**Storage:** `data/images/` (Root level, Gitignored).

### Core Logic
*   **Compression:** WebP, Max 2 Megapixels (1080p), Quality ~80.
*   **Pathing:**
    *   **Active:** `data/images/<hash>.webp`
    *   **Pending:** `data/images/pending/<filename_no_ext>.webp`

## 3. Migration System
**Module:** `backend/database/migration/`

### Two-Stage Migration Strategy
**Goal:** Clean separation between legacy data import (Stage 1) and reactive processing (Stage 2).

#### Stage 1: One-Time Legacy Import
*   **Trigger:** `POST /api/migration/migrate_legacy_db`
*   **Inputs:** `legacy_db_path`, `legacy_images_dir`
*   **Process:**
    1.  **DB Migration:**
        *   Migrate all Tags (preserve IDs).
        *   Migrate Models with SHA256 -> `models` table.
        *   Migrate Models without SHA256 -> `pending_import` table (preserve Legacy ID).
        *   Migrate relationships to `model_tags` or `pending_model_tags`.
    2.  **Image Migration:**
        *   Scan `meta_json` (legacy `extra_json`) for image paths.
        *   Extract filenames and search in `legacy_images_dir`.
        *   **Active Models:** Compress to High/Medium/Low WebP.
            *   Naming: `<sha256>_<seq>_<quality>.webp` (increment `seq` on conflict).
            *   Store in `data/images/`.
        *   **Pending Models:** Copy original image file.
            *   Store in `data/images/pending/`.
*   **Constraint:** Legacy DB/Files are accessed ONLY during this stage.

#### Stage 2: Reactive Migration
*   **Trigger:** Successful SHA256 calculation of a pending model.
*   **Action:**
    1.  Create Active Record in `models` table.
    2.  Migrate/Copy Tags from `pending_model_tags` to `model_tags`.
    3.  **Image Migration (Reactive):**
        *   Locate pending image in `data/images/pending/`.
        *   Compress/Move to `data/images/<new_hash>_<seq>_<quality>.webp`.
        *   Delete pending image.
    4.  Delete Pending Record.

## 4. API Logic (`backend/server/router.py`)

### Endpoint: `POST /api/migration/migrate_legacy_db`
*   **Parameters:** `legacy_db_path`, `legacy_images_dir`
*   **Returns:** Migration report (counts, errors).

### Endpoint: `POST /api/models/sha256`
*   **Parameters:** `path`, `pending_status` (`pending` | `ignore`)
*   **Logic:**
    *   Offload SHA256 calculation.
    *   If `pending_status == 'pending'`, trigger **Stage 2 Reactive Migration**.

## Non-Functional Requirements
*   **Concurrency:** Hashing must not block the main event loop.
*   **Gitignore:** Ignore `data/`.
