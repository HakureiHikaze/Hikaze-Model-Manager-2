# Specification: Migrate .codex Context to Conductor with Codebase Verification

## 1. Overview
The goal of this track is to analyze the legacy `.codex` directory (specifically constitution and guidelines) and migrate relevant design and product principles into the `conductor` ecosystem. 

**Crucially**, this migration must be grounded in reality. We will audit the documented features against the actual codebase to ensure the new Conductor documentation reflects the *current implemented state*, rather than potentially outdated designs.

## 2. Functional Requirements

### 2.1 Analysis & Audit
*   Analyze contents of `.codex/constitution` and `.codex/guidelines`.
*   Perform a codebase audit to verify if the documented rules, features, and guidelines exist in the implementation (`backend/`, `web/`, etc.).

### 2.2 Documentation Migration
*   Merge verified content from `.codex` into `conductor/product.md` and `conductor/product-guidelines.md`.
*   **Verification Rule:** If a feature is described in `.codex` but NOT found in the code, it must be:
    1.  Logged in a **Discrepancy Report**.
    2.  Marked clearly as "Not Implemented" or "Planned" if added to Conductor docs.
    3.  OR omitted if deemed obsolete.

### 2.3 Reporting
*   Generate a `discrepancy_report_codex_migration.md` in `conductor/discrepancies/` detailing:
    *   Features present in `.codex` but missing in code.
    *   Architectural rules violated or not followed.

## 3. Non-Functional Requirements
*   **ReadOnly Codebase:** This track focuses on documentation and analysis. Do not modify the application source code (Python/TS) unless strictly necessary for minor comment fixes.
*   **Single Source of Truth:** After this track, `conductor/` should be the primary reference, superseding `.codex`.

## 4. Acceptance Criteria
*   [ ] `conductor/product.md` and `conductor/product-guidelines.md` are updated with content from `.codex`.
*   [ ] A Discrepancy Report is created listing gaps between `.codex` docs and actual code.
*   [ ] All migrated documentation is verified to match the current codebase state.