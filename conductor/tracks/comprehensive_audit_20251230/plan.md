# Plan - Comprehensive Codebase & Design Audit (2025-12-30)

## Phase 1: Information Gathering & Scope Mapping [checkpoint: 916beac]
- [x] Task: Review all reference documents in `conductor/` and `_codex/` to establish the current "Design Baseline". [docs]
- [x] Task: Map the physical structure of `backend/`, `nodes/`, and `web/src` to identify all modules and components. [scan]
- [x] Task: Review previous discrepancy reports (`conductor/discrepancies/`) to filter out already addressed issues. [docs]
- [x] Task: Conductor - User Manual Verification 'Information Gathering & Scope Mapping' (Protocol in workflow.md)

## Phase 2: Multi-Dimensional Audit [checkpoint: 6f19693]
- [x] Task: Audit `backend/` logic (Routers, DB, Utils) against design docs and tech-stack. [audit]
- [x] Task: Audit `nodes/` (Custom Node implementations) for core logic consistency and user-facing requirements. [audit]
- [x] Task: Audit `web/src` (Components, Store, API layer) against UI/UX guidelines and product goals. [audit]
- [x] Task: Identify "Headless Artifacts" (interrupted code/design) and mark them as Development Junction Points. [audit]
- [x] Task: Conductor - User Manual Verification 'Multi-Dimensional Audit' (Protocol in workflow.md)

## Phase 3: Reporting & Recommendation [checkpoint: 1d0270b]
- [x] Task: Generate the comprehensive discrepancy report `20251230-comprehensive-audit.md` in `conductor/discrepancies/`. [report]
- [x] Task: Categorize findings into Missing, Undocumented, Deviations, and Junction Points. [docs]
- [x] Task: Review the report with the user to confirm findings and prioritize "collapsed" design decisions. [docs]
- [x] Task: Conductor - User Manual Verification 'Reporting & Recommendation' (Protocol in workflow.md)

## Phase 4: Design Consolidation & Documentation Update
- [ ] Task: Interactively update `conductor/product.md` and `conductor/tech-stack.md` based on audit results. [docs]
- [ ] Task: Interactively update `_codex/` design documents to reflect the reconciled reality. [docs]
- [ ] Task: Finalize and "collapse" the design baseline to ensure a 1:1 match with the valid codebase. [docs]
- [ ] Task: Conductor - User Manual Verification 'Design Consolidation & Documentation Update' (Protocol in workflow.md)
