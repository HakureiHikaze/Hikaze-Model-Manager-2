# Track Specification: ID-Based Reactive Migration Refactor

## Overview
This track refactors the model import logic to support ID-based "promotion" of pending models. It replaces the naive SHA256 API with a robust import system handling single operations, conflict resolution (Override/Merge/Delete), and multi-image sequence support. It also cleans up legacy image metadata.

## Functional Requirements

### 1. Legacy Import Update (Stage 1)
*   **Action:** Modify `backend/database/migration/importer.py`.
*   **Logic:** When migrating legacy models to `pending_import` or `models`, remove any keys related to image paths (e.g., `image`, `preview`, `images`) from the `meta_json`.

### 2. API: Single Model Import (`POST /api/migration/import_a_model`)
*   **Input:**
    ```json
    {
      "id": number,
      "conf_strategy": "override" | "merge" | "delete" | null
    }
    ```
*   **Locking:** Check in-memory lock. If locked, return `423 Locked`. Else, lock ID.
*   **Process:**
    1.  **Load:** Fetch pending record by `id`. Calculate SHA256.
    2.  **Conflict Check:** Query `models` table for `sha256`.
    3.  **Branching:**
        *   **No Conflict:**
            *   Insert new model record.
            *   Move tags.
            *   Promote image (Seq 0).
            *   Delete pending.
        *   **Conflict & `conf_strategy` is NULL:**
            *   Unlock.
            *   Return `409 Conflict`.
            *   Body: `{ "error": "Conflict", "existing": {...}, "pending": {...} }`.
        *   **Conflict & `override`:**
            *   Update existing model with ALL pending data.
            *   Merge tags (Union).
            *   **Image:** Overwrite existing images (Seq 0) with pending image.
            *   Delete pending.
        *   **Conflict & `merge`:**
            *   **Fields:** For each column, if existing is NULL/Empty and pending has value, update existing. Else keep existing.
            *   **Meta JSON:** Call `merge_meta_json(existing, pending)`.
            *   **Tags:** Merge (Union).
            *   **Image:** Promote pending image as a **NEW** example (Find next available `seq` index).
            *   Delete pending.
        *   **Conflict & `delete`:**
            *   Delete pending record and image.
            *   Return success.
    4.  **Unlock:** Remove in-memory lock.
*   **Response:** `{ "status": "success", "sha256": "...", "action_taken": "..." }`.

### 3. API: Get Sample Images (`POST /api/images/get_sample_imgs`)
*   **Input:** `{ "hash": string }`
*   **Logic:** Scan `data/images/` for files matching `<hash>_*.webp`.
*   **Response:** JSON list of relative URLs/filenames: `[ "hash_0.webp", "hash_1.webp" ]`.
*   *Note:* The client will append `?quality=...` when requesting the actual file.

### 4. API: Serve Image (`GET /api/images/{filename}`)
*   **Update:** Support filenames with sequence indices (e.g., `hash_0.webp`).
*   **Quality:** Handle `?quality=high|medium|low` (maps to physical file `hash_0_high.webp`).

### 5. Core Logic: Image Processor
*   **Update:** `promote_pending_image` to support target sequence index.
*   **Update:** `get_next_sequence_index(hash)` to find the next available slot.

## Non-Functional Requirements
*   **Concurrency:** In-memory locking.
*   **Data Integrity:** SQLite atomic commits.
