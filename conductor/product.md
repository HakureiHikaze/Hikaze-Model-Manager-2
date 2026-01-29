# Initial Concept
Custom ComfyUI node project scaffold (Python + Vue/TS) for Hikaze Model Manager 2.

# Product Guide - Hikaze Model Manager 2

## Target Users
- **ComfyUI Power Users:** Users who demand more advanced and efficient ways to handle extensive model libraries.
- **Workflow Developers:** Individuals building complex custom workflows who need reliable model loading and configuration.
- **AI Artists:** Creatives who require an organized, visually intuitive system to manage and select Checkpoints, LoRAs, and other assets, with safety-first defaults.

## Primary Goals
- **Unified Management Interface:** Introduce a dedicated manager page accessible via integrated buttons within custom nodes. The UI currently serves as a functional prototype with high-fidelity mock data, ready for backend integration.
- **Overlay-Driven Interaction:** Implement a Vue-based overlay system that sits atop native ComfyUI node regions, mapping complex UI form data to JSON strings within standard text inputs for backend consumption. Supports context-aware initial states via `embedded` and `initialTab` properties.
- **Global Manager Accessibility:** Provide a full-screen, dedicated web interface (served on a separate port) for stable and immersive model management, accessible from the ComfyUI sidebar or directly via browser.
- **Data Integrity & Evolution:** Transition the core data model from path-based identification to SHA256-prioritized indexing to ensure robust references even when files move.
- **Stage 1 Migration:** Import legacy databases into a pending queue, preserving legacy tags and metadata, with reactive image migration. (Implemented)
- **Stage 2 Migration:** Promotion of models from the pending queue to the active library with SHA256 deduplication and conflict resolution (override/merge/delete). (Implemented)

## Key Features
- **Context-Aware Manager Entry:** When entering the manager from a node (e.g., a Checkpoint loader), the view automatically filters to the relevant model category (Checkpoints/LoRA/CLIP/etc.). (Implemented)
- **Sophisticated Node Overlays:** Custom Vue overlays that replace or enhance standard node widgets, allowing for rich form elements that serialize their state into a hidden JSON input (`hikaze_payload`). (Implemented)
- **Rich Model Exploration:** A full-featured management suite including category tabs, toggleable card/list views, and reactive local search/tag filtering. (Implemented)
- **Lazy-Loaded Visuals:** High-performance card grid utilizing Intersection Observer and sequential WebP fetching (`/api/images/{hash}.webp?seq=N`). (Implemented)
- **Legacy Database Integration:** A multi-stage migration path to import legacy databases. Supports dynamic model type detection from the backend. (Implemented)
- **Persistent-Session Cache:** Model lists are fetched per category and cached in memory for instant tab switching, with manual refresh support. (Implemented)
- **Safety-First Defaults:** Automatic identification and exclusion of sensitive content (e.g., NSFW tags) on application load. (Implemented)
- **State Persistence:** Nodes rely on path-only data from the `hikaze_payload` for execution, ensuring a decoupled architecture. (Implemented)

## Future Roadmap
- **Model Auto-Discovery:** Automated scanning of ComfyUI model directories to populate the pending import queue. (Backend Implemented, Frontend Pending)
- **Advanced Metadata Form:** Extensible model detail forms based on `meta_json` schemas (e.g., description, community links, prompts). (Implemented)
- **Conflict Resolution UI:** Dedicated frontend interface for handling duplicates during model promotion. (Currently implemented via browser dialogs)
- **LoRA List Management:** Unified LoRA JSON protocol for power loaders. (Implemented as part of Node Overlays)

## Visual Design & UX
- **Evolutionary Aesthetic:** Inspired by the original [Hikaze Model Manager](https://github.com/HakureiHikaze/hikaze-model-manager), but rebuilt using Vue 3 for a more responsive and maintainable frontend experience.
- **Legacy Design Fidelity:** Retain the GitHub-inspired dark theme from the original plugin (`#0f1115` backgrounds, `#30363d` borders) to ensure familiarity.
- **Layout Structure:** Maintain the effective three-pane design: navigation/toolbar, main content area (supporting Grid and List views), and a right-side detail inspector (`320px-420px`).
- **Interactive States:** Reimplement the distinct visual cues for 'Selected' (Blue focus) and 'Picked/Active' (Green highlight) items to clearly distinguish between browsing and selection.
- **Thematic Consistency:** A design that feels like a natural extension of ComfyUI while introducing modern UI enhancements suitable for an information-rich management tool.
