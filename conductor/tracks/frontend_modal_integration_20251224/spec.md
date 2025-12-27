# Track Specification: Frontend Model Manager Integration

## Overview
This track implements the logic to open the Hikaze Model Manager as a modal overlay directly from the `HikazeCheckpointLoader` and `HikazeLoraPowerLoader` nodes. It enables users to browse, search, and select models (single or multiple) using the rich manager interface and return the selected file paths or configuration JSON back to the node's widgets.

## Functional Requirements

### 1. Global Manager Modal
*   **Component:** Implement or wrap `HikazeManagerLayout` to function as a full-screen modal.
*   **Trigger Mechanism:** Use Vue's `Provide/Inject` pattern within the frontend extension root to expose an `openManager(options)` method.
*   **Visibility:** The modal must overlay the entire ComfyUI interface (full-screen modal).

### 2. Node Integration (VueNodes Only)
*   **Checkpoint Loader:**
    *   **Trigger:** The "Select Checkpoint..." button in `HikazeCheckpointLoaderOverlay.vue`.
    *   **Mode:** Single Selection.
    *   **Initial Tab:** Hardcoded to `'checkpoints'`.
    *   **Return Data:** The absolute file path of the selected checkpoint, written to the `ckpt_name` widget.
*   **LoRA Power Loader:**
    *   **Trigger:** The "Select LoRA..." button in `HikazeLoraPowerLoaderOverlay.vue`.
    *   **Mode:** Multi-Selection.
    *   **Initial Tab:** Hardcoded to `'loras'`.
    *   **Return Data:** A JSON string adhering to `LoRAListDocument` (v2) format, containing selected LoRAs (strength=1.0, enabled=true), written to the `lora_json` widget.

### 3. Manager UI Enhancements
*   **Search Bar:** Relocate search input to the center of the filter bar.
*   **Action Area:** Add "Confirm" and "Cancel" buttons at the original search bar location.
*   **Selection Logic:**
    *   **Single Select:** Card click selects the item.
    *   **Multi Select:** 
        *   Render checkboxes on model cards.
        *   Card/Checkbox click adds/removes SHA256 from an ordered list.
    *   **Magic Number:** Control multi-select behavior via a prop/constant in the model library component.

### 4. Data Resolution
*   **Resolution Strategy:** Resolve selected SHA256 hashes to file paths and names using the frontend's local state (the data already fetched by `ModelLibrary`). No new backend API call is required for this resolution.

## Non-Functional Requirements
*   **Platform:** Support ONLY the modern ComfyUI VueNodes frontend.
*   **Interaction:** Clicking "Confirm" returns data; clicking "Cancel" or backdrop (optional) closes without changes.

## Out of Scope
*   Legacy LiteGraph (Canvas) UI support.
*   New Backend API development.
