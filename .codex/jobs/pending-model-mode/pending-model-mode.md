# Job: pending-model-mode

## Phase 1: Requirements and UX Alignment
- [x] Task: Confirm entry points and visibility rules
  - [x] Branch: Floating toolbar button (standalone only) shows badge count
  - [x] Branch: Embedded title bar button shows badge count
  - [x] Branch: Clicking badge switches manager to Pending mode
  - [x] Branch: Badge count driven by pending cache length
  - [x] Branch: Hide badge when count is zero
- [x] Task: Define Pending mode visual identity
  - [x] Branch: Amber accent palette applied to key UI states
  - [x] Branch: Mode indicator visible in manager header
- [x] Task: Confirm data flow and refresh triggers
  - [x] Branch: Pending cache is the data source in Pending mode
  - [x] Branch: Refresh on mode switch and after import completes
  - [x] Branch: Active cache invalidated after import
- [x] Task: Verify backend endpoints and payloads
  - [x] Branch: Pending list endpoint contract (`GET /api/migration/pending_models`)
  - [x] Branch: Pending detail endpoint contract (`GET /api/migration/pending_model?id=<id>`)
  - [x] Branch: Pending image endpoint contract (`GET /api/images/pending/{id}`)
  - [x] Branch: Import endpoint contract + conflict handling (`POST /api/migration/import_models`)
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (design phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed)
- [x] User manual verification

## Phase 2: Interaction and State Design
- [x] Task: Selection behavior in Pending mode
  - [x] Branch: Card/list checkboxes are visible in Pending mode
  - [x] Branch: Selection only via checkbox (card click shows details)
  - [x] Branch: Search and tag filters remain available
- [x] Task: Pending details panel behavior
  - [x] Branch: Fetch pending details via `GET /api/migration/pending_model?id=<id>`
  - [x] Branch: Read-only fields (no edits)
  - [x] Branch: Details image uses `GET /api/images/pending/{id}`
- [x] Task: Bulk import action design
  - [x] Branch: Action button location (toolbar + embedded title bar)
  - [x] Branch: Loading/progress/disabled states
  - [x] Branch: Success path refreshes pending + active caches
  - [x] Branch: Error handling and user feedback
  - [x] Branch: Conflict strategy default is null, prompt on conflicts, retry with conflicts only
- [x] Task: Mode switching behavior
  - [x] Branch: Active <-> Pending mode state reset rules
  - [x] Branch: Badge count refresh strategy
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (design phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed)
- [x] User manual verification

## Phase 3: Implementation
- [x] Task: Add Pending mode toggle UI with badge
  - [x] Branch: Floating toolbar button (standalone)
  - [x] Branch: Embedded title bar button
  - [x] Branch: Amber mode styling
- [x] Task: Wire Pending mode data source
  - [x] Branch: Switch to pending cache and refresh on entry
  - [x] Branch: Keep active cache intact for return
- [x] Task: Implement bulk import flow
  - [x] Branch: Call import API and await completion
  - [x] Branch: Refresh pending/active caches after success
  - [x] Branch: Handle errors and surface feedback
- [x] Task: Update guidelines (if new behavior added)
- [x] Quality Gates
  - [x] Build passes (if applicable)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed)
- [ ] User manual verification
