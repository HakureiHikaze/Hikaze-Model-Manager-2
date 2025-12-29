# Plan: Project Codebase Audit and Design Documentation Update

## Phase 1: Discovery & Analysis [checkpoint: 3341f1e]
- [x] Task: Audit `backend/` directory to identify database patterns, API structures, and utility logic not yet documented. 0ebc4fa
- [x] Task: Audit `nodes/` directory to understand the current implementation of model loaders and their interaction with the backend. 0ebc4fa
- [x] Task: Audit `web/` directory (both frontends) to map out the Vue.js architecture, state management, and communication protocols. 0ebc4fa
- [x] Task: Compare findings against existing `conductor/` and `_codex/` files to identify gaps. 0ebc4fa
- [x] Task: Conductor - User Manual Verification 'Discovery & Analysis' (Protocol in workflow.md) 0ebc4fa

## Phase 2: Documentation Update
- [ ] Task: Update `conductor/tech-stack.md` with any missing libraries, frameworks, or tools found during the audit.
- [ ] Task: Update `conductor/product.md` to ensure the feature list and product goals align with the actual implementation.
- [ ] Task: Update `_codex/design-current.md` to reflect the current architectural structure and data flow.
- [ ] Task: Update `_codex/design-notes.md` with specific design decisions, patterns, and "gotchas" discovered in the code.
- [ ] Task: Update `conductor/workflow.md` if any discovered development patterns (like migration steps) differ from the recorded workflow.
- [ ] Task: Conductor - User Manual Verification 'Documentation Update' (Protocol in workflow.md)

## Phase 3: Final Review & Consistency Check
- [ ] Task: Perform a cross-file consistency check to ensure terminology and architectural descriptions match across all updated documents.
- [ ] Task: Conductor - User Manual Verification 'Final Review' (Protocol in workflow.md)
