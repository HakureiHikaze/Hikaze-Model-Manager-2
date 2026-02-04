# Product Guidelines - Hikaze Model Manager 2

## Prose & Tone
- **Professional & Concise:** Text should be clear, direct, and focused on efficiency. Instructions and tooltips must avoid fluff and get straight to the point (e.g., "Select SHA256 for precise matching" instead of "We recommend using SHA256...").
- **Backend Consistency:** All backend-defined messages, logs, and error states must use hardcoded English to ensure maintainability and debuggability across different deployments.
- **Frontend Node Labels:** Text rendered directly on the node canvas (inputs, outputs, titles) must remain hardcoded in English to align with standard ComfyUI conventions.

## Visual Hierarchy & Layout
- **Image-First Exploration:** The main library view (left pane) must prioritize high-quality preview cards. The visual weight should be on the image, followed by the model name and a limited set of primary tags.
- **Preview Cycling:** For models with multiple images, preload all previews and crossfade every 7 seconds with randomized start offsets to avoid synchronized flips. (Implemented)
- **Mandatory Fullscreen Modal:** All model selection interfaces triggered from within ComfyUI nodes must occupy the full browser viewport to provide an immersive management experience. Windowed modal modes are strictly excluded.
- **Responsive Grid & Density:** The library grid must support dynamic column scaling (2-100 columns). When density increases (e.g., >6 columns), model titles should be hidden to reduce visual noise, relying on tooltips for identification.

...

## localization (i18n) Strategy
- **Manager Interface:** The full-screen manager UI must be fully localized using a standard i18n JSON solution (e.g., `en-US`, `zh-CN`). (Not Implemented - Currently hardcoded in English)
- **Configurable Language:** A language selection setting must be exposed via the native [ComfyUI Settings API](https://docs.comfy.org/zh-CN/custom-nodes/js/javascript_settings). (Not Implemented)
- **Extensibility:** The system should allow administrators (users with backend access) to drop in custom or community-sourced language JSON files to extend support beyond the pre-packaged English and Chinese options. (Planned)

## Testing & Resource Management
- **Manual Test Trigger Only:** Prohibit automatic execution of test suites (Pytest, Vitest, etc.) during implementation turns. Tests may only be run if the user provides an explicit command to do so. This policy is designed to prevent context overflow and minimize quota consumption due to verbose test outputs.

## Technical Presentation
- **On-Demand Complexity:** While the main view remains visual, the Details Sidebar must provide comprehensive technical data (paths, hashes, config specs) without requiring "Advanced Mode" toggles.
- **Conflict Resolution:** In migration or duplicate scenarios, always default to SHA256 as the source of truth over file paths.
