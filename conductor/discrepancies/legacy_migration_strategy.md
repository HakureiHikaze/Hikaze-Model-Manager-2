# Legacy Injection Analysis & Migration Strategy

**Date:** 2026-02-07
**Target System:** Hikaze Model Manager 2 (V2)
**Legacy Source:** `old_code/hikaze-model-manager/`

## 1. Legacy Architecture Analysis

The legacy system (`hikaze-model-manager` V1) injected UI elements directly into the ComfyUI canvas using the LiteGraph `draw` and `mouse` hooks.

### 1.1 Mechanism
-   **Widget Type:** Custom classes `HikazeIsolatedWidget` and `HikazeLoraPanelWidget`.
-   **Rendering:** Used HTML5 Canvas 2D Context (`ctx.fillRect`, `ctx.fillText`) inside the `draw` method.
-   **Interaction:** Used `mouse(event, pos, node)` to manually hit-test click coordinates against defined regions.
-   **Data Binding:** Directly mutated `node.loraItems`.

## 2. V2 Architecture (VueNodes)

The current V2 system uses a "Vue Portal" approach (`HikazeInjectionManager`) which depends on ComfyUI's "Modern Node Design" (Vue Nodes) features.

## 3. Hybrid Compatibility Strategy

The user requirement is to support **both** modes based on the user's ComfyUI settings ("Modern Node Design" On/Off).

### 3.1 The Gap
-   **Modern Mode (On):** `HikazeInjectionManager` works. DOM overlays appear.
-   **Legacy Mode (Off):** `HikazeInjectionManager` fails or has no target container. No UI appears.

### 3.2 Implementation Plan (Hybrid)
To support Legacy Mode, we must port the Canvas Drawing logic from the old code into the V2 codebase, but abstract it so it only activates when needed.

#### Architecture
1.  **Detection:** Check `app.ui.settings.getSettingValue('Comfy.NodeDesign')` (or similar) or detect if the node has a DOM widget container.
2.  **Controller Switch:**
    -   If **Modern**: Use `HikazeNodeFrame` (current V2 logic).
    -   If **Legacy**: Instantiate a new `HikazeLegacyCanvasController`.
3.  **HikazeLegacyCanvasController:**
    -   This controller will **not** mount a Vue app.
    -   Instead, it will inject `onDrawForeground` or `onDraw` methods into the `LGraphNode` instance.
    -   It will implement the `ctx` drawing commands found in `old_code/.../comfyui_extension.js`.
    -   It will handle `onMouseDown` for interaction.
    -   It must sync with the same `hikaze_payload` widget so the data is compatible.

### 3.3 Feasibility
-   **Feasible:** Yes. LiteGraph nodes allow dynamic method assignment.
-   **Data Compat:** The `hikaze_payload` is JSON. The legacy code used `node.loraItems` (array). The Legacy Controller must parse `hikaze_payload` -> `loraItems` for drawing, and serialize `loraItems` -> `hikaze_payload` on change.

## 4. Conclusion
The "Legacy Injection" path is required for users who disable Modern Node Design. We cannot simply "reject" it. We must implement a **Fallback Canvas Renderer**.

**Next Steps:**
1.  Create a new track: "Implement Legacy Canvas Fallback".
2.  Port `HikazeIsolatedWidget` / `HikazeLoraPanelWidget` logic to TypeScript.
3.  Integrate into `HikazeInjectionManager` to select the correct controller strategy.