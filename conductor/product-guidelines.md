# Product Guidelines - Hikaze Model Manager 2

## Prose & Tone
- **Professional & Concise:** Text should be clear, direct, and focused on efficiency. Instructions and tooltips must avoid fluff and get straight to the point (e.g., "Select SHA256 for precise matching" instead of "We recommend using SHA256...").
- **Backend Consistency:** All backend-defined messages, logs, and error states must use hardcoded English to ensure maintainability and debuggability across different deployments.
- **Frontend Node Labels:** Text rendered directly on the node canvas (inputs, outputs, titles) must remain hardcoded in English to align with standard ComfyUI conventions.

## Visual Hierarchy & Layout
- **Image-First Exploration:** The main library view (left pane) must prioritize high-quality preview cards. The visual weight should be on the image, followed by the model name and a limited set of primary tags.
- **Responsive Grid & Density:** The library grid must support dynamic column scaling (2-100 columns). When density increases (e.g., >6 columns), model titles should be hidden to reduce visual noise, relying on tooltips for identification.
- **Synchronized Tooltips:** Tooltips in the grid view must overlay the card image, synchronized to the parent card's full width (100%), ensuring no horizontal overflow or scrolling artifacts.
- **Clear Selection States:** Active/Selected items must be instantly recognizable via distinct borders (e.g., blue for focus, green for selection) without obscuring the preview content.
- **Segregated Detail View:** All technical metadata (SHA256 hashes, full file paths, extensive descriptions) must be strictly confined to the right-side "Model Preview/Details" sidebar.

## Detail View Strategy
- **Dual-Name Architecture:** The UI must clearly distinguish between the "Display Name" (editable database alias) and the "Physical Path" (read-only filesystem name).
- **Interactive Preview:** The detail image preview should serve as a control surface, offering overlay actions for "Open in New Tab" and "Upload Image" on hover.
- **Hash-Centric Validation:** A prominent "Calculate Hash" action should be available next to the SHA256 field, triggering a non-blocking background verification process.

## Interaction Principles
- **Low-Latency & Direct:** Interactions should feel immediate. Minimize decorative animations in favor of raw speed.
- **Chip Input Pattern:** Tag and trigger word inputs should utilize a "Chip" pattern. Users create chips via `Space` or `Comma` delimiters. Chips must support hover-to-delete interactions (`x` icon).
- **Click-to-Action:** Primary actions (selecting a model, switching tabs) should execute on a single click without unnecessary confirmation steps.
- **Safety-First Defaults:** The UI must proactively protect the user by automatically excluding sensitive content (identified via "nsfw" tags) on initialization. Users must explicitly opt-in to view this content via the filter settings.

## localization (i18n) Strategy
- **Manager Interface:** The full-screen manager UI must be fully localized using a standard i18n JSON solution (e.g., `en-US`, `zh-CN`).
- **Configurable Language:** A language selection setting must be exposed via the native [ComfyUI Settings API](https://docs.comfy.org/zh-CN/custom-nodes/js/javascript_settings).
- **Extensibility:** The system should allow administrators (users with backend access) to drop in custom or community-sourced language JSON files to extend support beyond the pre-packaged English and Chinese options.

## Testing & Resource Management
- **Manual Test Trigger Only:** Prohibit automatic execution of test suites (Pytest, Vitest, etc.) during implementation turns. Tests may only be run if the user provides an explicit command to do so. This policy is designed to prevent context overflow and minimize quota consumption due to verbose test outputs.

## Technical Presentation
- **On-Demand Complexity:** While the main view remains visual, the Details Sidebar must provide comprehensive technical data (paths, hashes, config specs) without requiring "Advanced Mode" toggles.
- **Conflict Resolution:** In migration or duplicate scenarios, always default to SHA256 as the source of truth over file paths.
