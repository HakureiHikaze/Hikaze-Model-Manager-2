# Product Guidelines - Hikaze Model Manager 2

## Prose & Tone
- **Professional & Concise:** Text should be clear, direct, and focused on efficiency. Instructions and tooltips must avoid fluff and get straight to the point (e.g., "Select SHA256 for precise matching" instead of "We recommend using SHA256...").
- **Backend Consistency:** All backend-defined messages, logs, and error states must use hardcoded English to ensure maintainability and debuggability across different deployments.
- **Frontend Node Labels:** Text rendered directly on the node canvas (inputs, outputs, titles) must remain hardcoded in English to align with standard ComfyUI conventions.

## Visual Hierarchy & Layout
- **Image-First Exploration:** The main library view (left pane) must prioritize high-quality preview cards. The visual weight should be on the image, followed by the model name and a limited set of primary tags.
- **Clear Selection States:** Active/Selected items must be instantly recognizable via distinct borders (e.g., blue for focus, green for selection) without obscuring the preview content.
- **Segregated Detail View:** All technical metadata (SHA256 hashes, full file paths, extensive descriptions) must be strictly confined to the right-side "Model Preview/Details" sidebar. This keeps the browsing experience clean and uncluttered.

## Interaction Principles
- **Low-Latency & Direct:** Interactions should feel immediate. Minimize decorative animations in favor of raw speed and responsiveness, catering to power users managing large libraries.
- **Click-to-Action:** Primary actions (selecting a model, switching tabs) should execute on a single click without unnecessary confirmation steps, unless data loss is a risk.

## Localization (i18n) Strategy
- **Manager Interface:** The full-screen manager UI must be fully localized using a standard i18n JSON solution (e.g., `en-US`, `zh-CN`).
- **Configurable Language:** A language selection setting must be exposed via the native [ComfyUI Settings API](https://docs.comfy.org/zh-CN/custom-nodes/js/javascript_settings).
- **Extensibility:** The system should allow administrators (users with backend access) to drop in custom or community-sourced language JSON files to extend support beyond the pre-packaged English and Chinese options.

## Technical Presentation
- **On-Demand Complexity:** While the main view remains visual, the Details Sidebar must provide comprehensive technical data (paths, hashes, config specs) without requiring "Advanced Mode" toggles.
- **Conflict Resolution:** In migration or duplicate scenarios, always default to SHA256 as the source of truth over file paths.
