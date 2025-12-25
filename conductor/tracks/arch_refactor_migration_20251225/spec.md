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

### Shadow File System (Dev Tool)
*   **Generator:** Create zero-byte `shadow_<name>.safetensors` in `debug_models` mirroring structure.
*   **Mock Hasher:** (Dev Mode) Return DB hash or deterministic hash instead of reading file.

### Reactive Migration (Logic)
*   **Trigger:** Successful SHA256 calculation of a pending model.
*   **Action:**
    1.  Create Active Record (Main Table).
    2.  Delete Pending Record.
    3.  Move/Rename Image: `pending/<name>.webp` -> `active/<hash>.webp`.
    4.  Delete old image file.

## 4. API Logic (`backend/server/router.py`)

### Endpoint: `POST /api/models/sha256`
*   **Parameters:**
    *   `path` (string): File path.
    *   `pending_status` (string): `pending` | `ignore`.
*   **Logic:**
    1.  **Offload Calculation:** Run SHA256 hasher in a non-blocking thread/executor.
    2.  **Result:** Get `hash`.
    3.  **Branch:**
        *   If `pending_status == 'pending'`: Execute **Reactive Migration**.
        *   If `pending_status == 'ignore'`: Do nothing extra.
    4.  **Return:** `{ "sha256": "..." }`

## Non-Functional Requirements
*   **Concurrency:** Hashing must not block the main event loop.
*   **Gitignore:** Ignore `data/`.
