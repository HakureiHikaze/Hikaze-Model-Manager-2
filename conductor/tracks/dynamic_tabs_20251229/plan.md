# Plan: Dynamic Tab Rendering in HikazeManagerLayout

## Phase 1: Setup & API Integration
- [x] Task: Create and switch to a new development branch `tabs_dev`. 8e8c0ca
- [x] Task: Implement a utility or service function to fetch model types from `/api/models/get_types`. 4df0d51
- [x] Task: Define the `activeTab` state and loading/error states within `HikazeManagerLayout`. 4a2ec81
- [~] Task: Conductor - User Manual Verification 'Setup & API Integration' (Protocol in workflow.md)

## Phase 2: Dynamic UI Implementation
- [ ] Task: Update `HikazeManagerLayout.vue` to dynamically render tabs from the API response.
- [ ] Task: Append the "Others" tab to the end of the fetched list.
- [ ] Task: Implement CSS/Logic for scrollable tab navigation and active tab highlighting.
- [ ] Task: Implement loading spinner and error retry UI for the tab bar.
- [ ] Task: Conductor - User Manual Verification 'Dynamic UI Implementation' (Protocol in workflow.md)

## Phase 3: Property Logic & Cleanup
- [ ] Task: Implement logic to resolve `activeTab` on mount using `initialTab` prop and fetched types.
- [ ] Task: Remove hardcoded mock tab navigation from `App.vue`.
- [ ] Task: Ensure `embedded` prop correctly toggles the visibility of the tab bar.
- [ ] Task: Conductor - User Manual Verification 'Property Logic & Cleanup' (Protocol in workflow.md)
