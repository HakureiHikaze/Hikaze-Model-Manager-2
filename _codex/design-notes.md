# Hikaze Model Manager 2 - Design Notes and Updates

## Scope and Status
- This document captures current design intent and updated decisions based on code review.
- No changes to conductor artifacts are made or required.
- Frontend development is paused until backend import flow stabilizes.

## Data Flow (clarified)
- Backend database responds to manager UI requests.
- Manager UI resolves model metadata and then passes path-only data to node overlays.
- Node backend logic operates only on resolved file paths; server and node execution remain decoupled.

## Itemized Review (1-19)
1) lora_list_parser.py and dataclasses.py
   - Purpose aligns with backend parsing of LoRA list JSON payloads.
   - Current parser expects "LoRAList" but loraListExample.json and frontend use "LoRAs".
   - If strict backend validation is required, keep parser but update it to accept "LoRAs" and the canonical schema.
   - If nodes only need flexible parsing, the current inline parsing in HikazeLoraPowerLoader may be sufficient; a dedicated parser may be optional.

2) hasher.py
   - The module is suitable for Stage 2 import-by-pending-id hashing.
   - It is currently unused; wire it to the future import endpoint (not /api/models/sha256).

3) numbers.ts
   - Unused and safe to remove when frontend cleanup resumes.

4) lora.ts parseLoRAListJson/createEmptyLoRAListDocument
   - Dev-only helpers; not required for production overlay logic.
   - Safe to remove when frontend cleanup resumes.

5) HelloWorld.vue
   - Unused and safe to remove when frontend cleanup resumes.

6) NodeShell.vue
   - Keep for frontend dev workflow; do not remove.

7) migration module cleanup
   - Remove dead imports and references to MigrationManager/Worker/processor/merger.
   - Remove /api/models/sha256 and reactive migration triggers.
   - Stage 2 import should be driven by pending id via the import endpoint.

8) image upload sequence
   - Stage 1 migration already uses seq naming (hash_seq_quality.webp).
   - New uploads should also allocate a seq (0 or next available) to avoid mismatch.
   - Ensure get_image_path and upload logic agree on the same naming convention.

9) handle_import_a_model and /api/migration/import_a_model
   - Planned endpoint; keep as future work.

10) ModelDetails.vue icon encoding
    - Known issue, de-prioritized for now.

11) remove MigrationManager/Worker/processor/merger planning
    - Remove from design scope and documentation updates in this file only.

12) /api/images/get_sample_imgs
    - Implementable using ImageProcessor.get_image_list().
    - Decide on return shape: base names (hash_seq) or filenames (hash_seq.webp) and keep client consistent.

13) conflict strategies (override/merge/delete)
    - Defer until pending import endpoint is implemented.

14) frontend placeholders
    - Keep placeholders; connect after backend import flow is stable.

15) frontend paused
    - Acknowledge pause status for current development phase.

16) base model field removal
    - Remove from UI design; tags are stored via tags and model_tags tables.

17) data flow path-switching
    - After manager resolves metadata, node payloads should use path-only data.
    - Node backend and server must stay decoupled.

18) i18n/settings API
    - Defer for now; not in near-term scope.

19) grid column limit
    - Keep 2-10 column limit; no change required.

## Code Alignment Notes
- backend/util/hasher.py provides SHA256 hashing but is not wired to any endpoint yet.
- util/lora_list_parser.py does not accept the "LoRAs" key used in loraListExample.json and the frontend.
- web/custom_node_frontend/src/util/lora.ts exports stringifyLoRAListDocument, which writes "LoRAs".
- backend/util/image_processor.py expects seq for active images, but upload currently saves without seq.

## API Decisions (updated)
- Remove /api/models/sha256 from the target design.
- Use /api/migration/import_a_model as the sole trigger for pending import.
- Add /api/images/get_sample_imgs to list available sequences for a hash.

## Image Pipeline Decisions (updated)
- Active images: always saved as hash_seq_quality.webp.
- Pending images: store original file under data/images/pending/ with pending id.
- Promotion: compute next sequence index for merge, or seq 0 for initial import.

## Deferred Items
- UI wiring to backend APIs.
- Localization and settings API.
- Conflict resolution behavior until import endpoint is built.
