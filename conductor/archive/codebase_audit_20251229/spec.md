# Specification: Project Codebase Audit and Design Documentation Update

## Overview
This track involves a comprehensive audit of the `Hikaze-Model-Manager-2` codebase to identify architectural patterns, design decisions, and technical implementations that have evolved but are not yet reflected in the project's documentation within the `conductor/` and `_codex/` directories.

The goal is to ensure that the documentation serves as an accurate source of truth for the project's current state.

## Functional Requirements
- **Comprehensive Codebase Audit:** Analyze all major project components:
    - `backend/`: Database management, server logic, and utilities.
    - `nodes/`: Custom ComfyUI node implementations and loaders.
    - `web/`: Both `custom_node_frontend` (Vite/Vue) and `model_manager_frontend` architectures.
- **Documentation Synchronization:** Update the following files based on findings:
    - `conductor/product.md`: Ensure features and user goals align with current capabilities.
    - `conductor/tech-stack.md`: Verify that all libraries and technologies used in the code are listed.
    - `conductor/workflow.md`: Align development processes with actual practices (e.g., migration protocols).
    - `_codex/design-current.md`: Update the architectural overview to reflect the current structure.
    - `_codex/design-notes.md`: Capture specific design decisions found in the code that were previously undocumented.

## Non-Functional Requirements
- **Consistency:** Ensure consistent terminology across all documentation files.
- **Clarity:** Use clear, professional language to describe complex architectural choices.

## Acceptance Criteria
- [ ] All major architectural components found in the code are represented in `_codex/design-current.md`.
- [ ] The `tech-stack.md` accurately lists current dependencies and frameworks (Vue, Vite, FastAPI/Node, etc.).
- [ ] Any "hidden" design patterns (e.g., specific ways nodes communicate with the backend) are documented in `_codex/design-notes.md`.
- [ ] The `product.md` reflects the current feature set of the Model Manager.

## Out of Scope
- Code refactoring or bug fixes (discovery and documentation only).
- Creation of new features.
