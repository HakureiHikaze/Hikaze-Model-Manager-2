# Initial Concept
Custom ComfyUI node project scaffold (Python + Vue/TS) for Hikaze Model Manager 2.

# Product Guide - Hikaze Model Manager 2

## Target Users
- **ComfyUI Power Users:** Users who demand more advanced and efficient ways to handle extensive model libraries.
- **Workflow Developers:** Individuals building complex custom workflows who need reliable model loading and configuration.
- **AI Artists:** Creatives who require an organized, visually intuitive system to manage and select Checkpoints, LoRAs, and other assets.

## Primary Goals
- **Unified Management Interface:** Introduce a dedicated manager page accessible via integrated buttons within custom nodes, facilitating seamless data feedback.
- **Overlay-Driven Interaction:** Implement a Vue-based overlay system that sits atop native ComfyUI node regions, mapping complex UI form data to JSON strings within standard text inputs for backend consumption.
- **Global Manager Accessibility:** Provide a full-screen modal manager accessible from the ComfyUI sidebar or a similar high-level API entry point.
- **Data Integrity & Evolution:** Transition the core data model from path-based identification to SHA256-prioritized indexing to ensure robust references even when files move.

## Key Features
- **Context-Aware Manager Entry:** When entering the manager from a node (e.g., a Checkpoint loader), the view automatically filters to the relevant model category (Checkpoints/LoRA/CLIP/etc.).
- **Sophisticated Node Overlays:** Custom Vue overlays that replace or enhance standard node widgets, allowing for rich form elements that serialize their state into a hidden JSON input.
- **Rich Model Exploration:** A full-featured management suite including category tabs, toggleable card/list views, and detailed metadata sidebars.
- **Legacy Database Integration:** A manual migration path in the settings to import legacy databases (DB and preview directories) from the previous version, with SHA256 deduplication and conflict resolution.
- **State Persistence:** Backend logic that parses incoming JSON from nodes based on versioned schemas, ensuring reliable execution and future-proofing.

## Visual Design & UX
- **Evolutionary Aesthetic:** Inspired by the original [Hikaze Model Manager](https://github.com/HakureiHikaze/hikaze-model-manager), but rebuilt using Vue 3 for a more responsive and maintainable frontend experience.
- **Legacy Design Fidelity:** Retain the GitHub-inspired dark theme from the original plugin (`#0f1115` backgrounds, `#30363d` borders) to ensure familiarity.
- **Layout Structure:** Maintain the effective three-pane design: navigation/toolbar, main content area (supporting Grid and List views), and a right-side detail inspector (`320px-420px`).
- **Interactive States:** Reimplement the distinct visual cues for 'Selected' (Blue focus) and 'Picked/Active' (Green highlight) items to clearly distinguish between browsing and selection.
- **Thematic Consistency:** A design that feels like a natural extension of ComfyUI while introducing modern UI enhancements suitable for an information-rich management tool.
