# Plan: Legacy Injection Analysis & Migration Strategy

## Phase 1: Setup & Initial Analysis
- [x] Task: Create and checkout branch `legacy_node_layout`.
- [x] Task: List files in `old_code/` to identify key components (entry points, widget logic).
- [x] Task: Perform a surface-level scan of the old code for "LGraphNode", "app.registerExtension", and "canvas" interactions.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & Initial Analysis' (Protocol in workflow.md)

## Phase 2: Deep Dive into Legacy Injection
- [x] Task: Analyze the registration process of the old extension and its lifecycle hooks.
- [x] Task: Identify the specific rendering mechanism used (e.g., `onDrawForeground`, `drawWidget`, or direct DOM overlays).
- [x] Task: Determine how the old system handled coordinate transformations and scaling during canvas zoom.
- [x] Task: Understand the data binding mechanism between the overlay and the internal node state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Deep Dive into Legacy Injection' (Protocol in workflow.md)

## Phase 3: V2 Compatibility & Migration Mapping
- [x] Task: Compare legacy rendering with the current `HikazeInjectionManager` and `HikazeNodeFrame` (Vue Portal).
- [x] Task: Identify potential conflicts (z-index, event bubbling, coordinate systems) if legacy logic is ported.
- [x] Task: Propose a refactored `BaseHikazeNodeController` extension to support legacy-style "Canvas Overlays" if needed.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: V2 Compatibility & Migration Mapping' (Protocol in workflow.md)

## Phase 4: Documentation & Finalization
- [x] Task: Draft the final Migration Strategy report detailing the feasibility and implementation path.
- [x] Task: Update project guidelines (e.g., `architecture-index.md`) to reflect findings.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Documentation & Finalization' (Protocol in workflow.md)
