# Plan: Dynamic Tab Rendering in HikazeManagerLayout

## Phase 1: Setup & API Integration [checkpoint: e0cfe39]
- [x] Task: Create and switch to a new development branch `tabs_dev`. 8e8c0ca
- [x] Task: Implement a utility or service function to fetch model types from `/api/models/get_types`. 4df0d51
- [x] Task: Define the `activeTab` state and loading/error states within `HikazeManagerLayout`. 4a2ec81
- [x] Task: Conductor - User Manual Verification 'Setup & API Integration' (Protocol in workflow.md) e0cfe39

## Phase 2: Dynamic UI Implementation [checkpoint: 4b22cf0]
- [x] Task: Update `HikazeManagerLayout.vue` to dynamically render tabs from the API response. 1d2420b
- [x] Task: Append the "Others" tab to the end of the fetched list. 1d2420b
- [x] Task: Implement CSS/Logic for scrollable tab navigation and active tab highlighting. 1d2420b
- [x] Task: Implement loading spinner and error retry UI for the tab bar. 1d2420b
- [x] Task: Conductor - User Manual Verification 'Dynamic UI Implementation' (Protocol in workflow.md) 4b22cf0

## Phase 3: Property Logic & Cleanup
- [ ] Task: Implement logic to resolve `activeTab` on mount using `initialTab` prop and fetched types.
- [ ] Task: Remove hardcoded mock tab navigation from `App.vue`.
- [ ] Task: Ensure `embedded` prop correctly toggles the visibility of the tab bar.
- [ ] Task: Conductor - User Manual Verification 'Property Logic & Cleanup' (Protocol in workflow.md)
