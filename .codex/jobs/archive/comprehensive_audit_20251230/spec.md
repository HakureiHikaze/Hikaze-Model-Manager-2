# Specification - Comprehensive Codebase & Design Audit (2025-12-30)

## Overview
This track executes a comprehensive "deep-dive" audit of the Hikaze-Model-Manager-2 codebase to reconcile the actual implementation with the intended design. The goal is to identify all discrepancies between the code and the documentation, generate a detailed report, and then interactively merge the reconciled design realities back into the project's documentation. This ensures that the documentation serves as an accurate "Source of Truth" for future development.

## Functional Requirements
- **Scope of Analysis:**
    - **Included:** Deep analysis of `backend/` (Python), `web/src` (Vue/TS), and **`nodes/` (Custom Node logic)**.
    - **Excluded:** `dist/`, `node_modules/`, `__pycache__/`, `tests/`, `scripts/`, and generated assets.
- **Reference Documents (Source of Truth):**
    - `conductor/product.md`
    - `conductor/tech-stack.md`
    - `conductor/product-guidelines.md`
    - `_codex/design-current.md` (and related `_codex/` docs)
- **Discrepancy Reporting:**
    - Analyze the codebase to identify:
        1.  **Missing Features:** Design requirements explicitly stated but not found in the code.
        2.  **Undocumented Features:** Code implemented but not reflected in the design documents.
        3.  **Deviations:** Areas where the implementation logic or structure differs from the design plan.
        4.  **'Headless' Artifacts:** Explicitly identify unfinished code segments or interrupted design plans resulting from the previous session's interruption. Mark these as **"Development Junction Points"** to prioritize them for immediate future work.
    - Create a new discrepancy report (e.g., `conductor/discrepancies/20251230-comprehensive-audit.md`).
    - **Note:** Filter out previously resolved discrepancies from past reports; focus on new or persisting issues.
- **Design Consolidation:**
    - After the report is generated and reviewed, interactively update the reference documents (`conductor/*.md`, `_codex/*.md`) to reflect the "collapsed" reality of the project (i.e., updating docs to match valid code, or noting code that must change).

## Non-Functional Requirements
- **Exhaustiveness:** The audit must be thorough for the defined scope.
- **Accuracy:** Findings must be specific (referencing file paths or specific logic) rather than general observations.

## Acceptance Criteria
- [ ] A comprehensive discrepancy report is generated and saved in the track or discrepancies folder.
- [ ] The discrepancy report covers `backend/`, `web/src`, and `nodes/`, categorizing findings (Missing, Undocumented, Deviations, and Development Junction Points).
- [ ] Design documentation (`conductor/` and `_codex/` files) is updated and committed to reflect the reconciled state of the project.

## Out of Scope
- Code refactoring or bug fixing (unless incidental). The primary output is documentation and analysis.
- Auditing `tests/` or build scripts.
