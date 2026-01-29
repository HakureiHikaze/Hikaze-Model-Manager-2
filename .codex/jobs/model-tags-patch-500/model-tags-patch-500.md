# Job: model-tags-patch-500

## Phase 1: Error Intake and Reproduction Scope
- [x] Task: Capture the failing PATCH request payload and response for a single model save
- [x] Task: Confirm whether the issue occurs in both standalone and embedded manager
- [x] Task: Map frontend save flow to backend handler entrypoints
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (analysis phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed) - N/A (analysis phase)
- [x] User manual verification - N/A (analysis phase)

## Phase 2: Backend Tag Update Analysis
- [x] Task: Trace tag update handling from request payload into database writes
- [x] Task: Identify why a dict reaches int() and propose the correct conversion path
- [x] Task: Draft backend fix plan aligned to existing API contracts
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (analysis phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed) - N/A (analysis phase)
- [x] User manual verification - N/A (analysis phase)

## Phase 3: Frontend Payload Validation
- [x] Task: Inspect frontend ModelDetails save payload and tag shape - N/A (backend-only scope)
- [x] Task: Confirm adapters and types match API contract expectations - N/A (backend-only scope)
- [x] Task: Decide whether to normalize tags client-side or server-side - N/A (backend-only scope)
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (backend-only scope)
  - [x] Evidence recorded (file refs / command output) - N/A (backend-only scope)
  - [x] Docs updated (if needed) - N/A (backend-only scope)
- [x] User manual verification - N/A (backend-only scope)

## Phase 4: Fix and Validation
- [x] Task: Implement backend tag normalization and adapter utility
- [x] Task: Update API contract or guidelines if payload shape changes - Not needed (backward compatible)
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (backend-only change)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed) - N/A (backward compatible)
- [x] User manual verification
