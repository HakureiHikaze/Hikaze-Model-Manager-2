# Specification: Dynamic Tab Rendering and Navigation in HikazeManagerLayout

## Overview
This track implements dynamic tab rendering within the `HikazeManagerLayout` component. It replaces the hardcoded mock tabs currently in `App.vue` with data fetched from the backend API. The layout will adapt its tab bar based on the available model types and correctly handle initial tab selection through the `embedded` and `initialTab` properties.

## Functional Requirements
- **Dynamic Tab Fetching:** On component mount, `HikazeManagerLayout` must fetch model types from the `/api/models/get_types` endpoint.
- **Tab Rendering:**
    - Render a tab for each type returned by the API.
    - Append a hardcoded "Others" tab at the end of the list to handle non-standard model types.
    - Remove the hardcoded `<nav class="type-tabs">` from `App.vue`.
- **Initial Tab Selection:**
    - If an `initialTab` prop is provided and matches one of the fetched types (or "Others"), set it as the active tab.
    - Otherwise, default to the first tab returned by the API.
- **UI States and Behavior:**
    - **Loading State:** Provide visual feedback (e.g., a spinner or skeleton) while model types are being fetched.
    - **Error Handling:** Gracefully handle API failures by showing an error message or a retry option.
    - **Scrollable Navigation:** The tab bar must be scrollable if the number of tabs exceeds the container's width.
    - **Active Highlighting:** Ensure the active tab is clearly highlighted according to the project's design guidelines.
- **State Management:** Manage the `activeTab` state internally within `HikazeManagerLayout` or propagate it to parent components as needed.

## Non-Functional Requirements
- **Consistency:** Maintain the GitHub-dark aesthetic (`#0f1115` backgrounds, `#30363d` borders).
- **Responsiveness:** Ensure the tab bar remains functional on different screen sizes.

## Acceptance Criteria
- [ ] Tabs are dynamically generated based on API response from `/api/models/get_types`.
- [ ] An "Others" tab is present at the end of the navigation.
- [ ] The `initialTab` prop correctly determines the active tab on mount.
- [ ] Loading and error states are visible and functional.
- [ ] The tab bar is scrollable when overflowing.
- [ ] Mock tabs in `App.vue` are removed.

## Out of Scope
- Implementing the backend-driven model library refresh logic when a tab is changed (the UI state will change, but model fetching is deferred to a future track).
