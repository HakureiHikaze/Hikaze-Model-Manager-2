# Job: lora-power-loader-enhancement

## Phase 1: Requirements and Feasibility
- [x] Task: Summarize UX requirements
  - [x] Detail: Open manager from node in LoRA-only mode, hide tabs
  - [x] Detail: Selected LoRA bar under title, above filters, left of details
  - [x] Detail: Card/list checkbox; click card or checkbox selects; unselect only via checkbox
  - [x] Detail: "Clear selection" button in modal title bar; does not close modal
  - [x] Detail: Filters/sorting apply only to library, not selected list
- [x] Task: Summarize data flow and merge rules
  - [x] Detail: Pass payload JSON into manager; parse to LoRAListDocument
  - [x] Detail: Maintain working copy; selected set derived from working copy
  - [x] Detail: On confirm, keep original entry if sha256 exists (preserve strengths)
  - [x] Detail: Add new entries for newly selected sha256; remove deleted sha256
  - [x] Detail: Model details update only on card/list click, not on checkbox toggle
- [x] Task: Feasibility assessment and risks
  - [x] Detail: Feasible with changes to modal, library UI, and payload handling
  - [x] Detail: Ensure LoRA tab name matches backend model types (mapping if needed)
  - [x] Detail: Selected list layout needs placement that does not compress details pane
- [x] User manual verification

## Phase 2: Implementation Design
- [x] Task: Component and file changes
  - [x] Detail: Extend modal options to accept payload JSON
  - [x] Detail: Update HikazeManagerModal to manage LoRA selection state
  - [x] Detail: Update ModelLibrary to support selection checkboxes and exclude selected
  - [x] Detail: Add SelectedLoraBar UI (new component or library sub-panel)
  - [x] Detail: SelectedLoraBar is single-row, six equal columns; overflow scroll when >6; remains card-style in list view
  - [x] Detail: New component likely under model_manager_frontend/components, shared with embedded via alias
- [x] Task: State model and merge algorithm
  - [x] Detail: Preserve original LoRAListDocument for strength merge
  - [x] Detail: Working selection list uses sha256 set + model metadata map
  - [x] Detail: Confirm merge: keep original entries when sha256 matches to preserve strengths
- [x] Task: UX behaviors
  - [x] Detail: Checkbox toggles selection without changing details (stopPropagation)
  - [x] Detail: Card click updates details and selects if not yet selected
  - [x] Detail: Clear selection button empties selection without closing modal
- [x] User manual verification

## Phase 3: Implementation
- [x] Task: Implement LoRA selection UI and selected bar
  - [x] Detail: Add SelectedLoraBar component and wire into modal library pane
  - [x] Detail: Match SelectedLoraBar card styling to ModelLibrary with static preview (no carousel)
  - [x] Detail: ModelLibrary checkboxes and selection behavior for LoRA mode
  - [x] Detail: Fix modalState readonly unwrapping access to avoid setup runtime error
- [x] Task: Wire payload parsing and merge on confirm
  - [x] Detail: Modal parses payloadJson into original LoRA map and selection set
  - [x] Detail: Confirm merges selection with original strengths preserved
- [x] Task: Verify node overlay updates hikaze payload on confirm
  - [x] Detail: LoRA overlay passes payloadJson into openManager options
- [x] User manual verification

## Phase 4: Build Verification
- [x] Task: Run frontend builds
  - [x] Detail: `web/model_manager_frontend` run `npm run build`
  - [x] Detail: `web/custom_node_frontend` run `npm run build`
- [x] User manual verification
