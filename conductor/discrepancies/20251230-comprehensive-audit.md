# Comprehensive Discrepancy Report - 2025-12-30

## Executive Summary
This report summarizes the findings of a deep-dive audit of the Hikaze-Model-Manager-2 project. While the core architecture (SHA256 identity, Node-Server decoupling) is solid, significant gaps exist between the implementation and the design documentation, particularly in the frontend UI and certain backend utility integrations. Several "headless" artifacts from previous interrupted sessions have been identified as high-priority "Development Junction Points".

---

## 1. Missing Features (Design > Code)
- **Automatic Model Scanning:** `POST /api/models/scan` and its corresponding utility `backend/util/scanner.py` are missing. Users cannot currently sync the database with new files in ComfyUI directories.
- **Dynamic Model Types in UI:** `ModelDetails.vue` uses a hardcoded `<select>` for model types instead of fetching them via `GET /api/models/get_types`.
- **Calculate Hash Action:** The "⚡" (Calculate Hash) button in `ModelDetails.vue` only triggers an alert; no backend implementation or frontend wiring exists for this feature.
- **Conflict Resolution UI:** While the backend `import_models` supports conflict strategies (override/merge/delete), the frontend "Pending Import" UI is not yet implemented or wired to these strategies.

## 2. Undocumented Features (Code > Design)
- **Other Models Logic:** `DatabaseManager.get_other_models` handles models with unknown types. This is implemented in code but not explicitly detailed in `_codex/backend_apis.md`.
- **Image Deletion Shifting:** `ImageProcessor.delete_image_sequence` implements logic to shift subsequent images down when one is deleted. This sophisticated logic is not mentioned in the design docs.
- **Sniffer Cache:** `model_type_sniffer.py` implements a JSON caching mechanism (`types_cache.json`) for model types, which is undocumented.

## 3. Deviations (Logic/Structure Mismatch)
- **LoRA List Schema Mismatch:** `lora_list_parser.py` enforces a strict schema (`LoRAList`, `MStrength`, `toggleOn`), whereas `HikazeLoraPowerLoader.execute` and `loraListExample.json` use more flexible/different keys (`LoRAs`, `strength_model`, `enabled`).
- **Parser Bypass:** `HikazeLoraPowerLoader` bypasses the dedicated `lora_list_parser.py` entirely, using inline `json.loads` and manual dictionary access.
- **Node Widget Visibility:** `hikaze_payload` is intended to be a hidden/internal widget but is currently visible on the node for debugging purposes.
- **Image List Return Type:** The design suggests `get_sample_imgs` should return URLs, but `ImageProcessor.get_image_list` returns base names (hash_seq), requiring the router to transform them.

## 4. Development Junction Points (Headless Artifacts)
- **Deprecated Migration Logic:** `handle_import_a_model` and `_import_pending_model` in `router.py` are remnants of an older migration flow. They should be unified or removed in favor of `handle_import_models`.
- **Scanner Placeholder:** The `backend/util/` directory lacks the scanner logic required for the "Auto-Discovery" feature.
- **Frontend/Backend Wiring Gap:** Core API methods in `web/src/api/models.ts` are defined but not utilized by components (e.g., `deleteImage`, `fetchImageCount` inside details).
- **Incomplete SHA256 Verification:** The `hasher.py` exists but is only used during import, not for the "on-demand" verification requested in the UI.

---

## Actionable Recommendations
1. **Refactor LoRA Parser:** Update `lora_list_parser.py` to be the single source of truth for LoRA JSON parsing, supporting the flexible keys used by the frontend.
2. **Wire Dynamic Types:** Update `ModelDetails.vue` to fetch types from `GET /api/models/get_types`.
3. **Implement Scanner:** Prioritize the creation of `backend/util/scanner.py` to enable model auto-discovery.
4. **Cleanup Router:** Remove deprecated migration handlers and consolidate logic into the batch `import_models` flow.
5. **Hide Payload Widget:** Set `socketless=True` and ensure the frontend overlay correctly manages the widget visibility.
