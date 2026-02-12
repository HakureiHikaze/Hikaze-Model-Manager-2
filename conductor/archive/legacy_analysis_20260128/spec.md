# Specification: Legacy Injection Analysis & Migration Strategy

## 1. Overview
This track focuses on analyzing the legacy codebase (located in `old_code/`) to understand its mechanism for injecting UI overlays onto the ComfyUI canvas. The goal is to determine how this legacy approach can be adapted or migrated to work within the completely refactored `Hikaze-Model-Manager-2` architecture, ensuring compatibility with the new injection system.

## 2. Functional Requirements

### 2.1 Branch Management
*   **Action:** Create a new git branch named `legacy_node_layout` from the current branch.

### 2.2 Analysis of Legacy Injection
*   **Source:** Analyze files in `old_code/` (specifically looking for ComfyUI extension registration, `onNodeCreated`, `draw`, or DOM manipulation logic).
*   **Mechanism:** Identify how the old system:
    *   Detected target nodes.
    *   Created overlay elements (DOM or Canvas).
    *   Synced data between the overlay and the node widgets.
    *   Handled positioning and scaling.

### 2.3 Compatibility Assessment
*   Compare the legacy mechanism with the current `HikazeInjectionManager` and `BaseHikazeNodeController` in `web/custom_node_frontend/src/injection/`.
*   Determine if the old "Canvas Injection" style conflicts with the new "Vue Portal" style.

### 2.4 Migration Strategy
*   Develop a plan to port the legacy functionality (likely specific widget overlays) into the new system.
*   The output should be a technical design document or a set of architectural decisions, not necessarily the code implementation itself (unless simple).

## 3. Technical Requirements
*   **Input:** `old_code/` directory (provided by user).
*   **Output:** A report or updated `tech-stack.md`/`architecture-index.md` describing the "Legacy Injection Pattern" and how it fits (or doesn't fit) into V2.

## 4. Acceptance Criteria
*   [ ] Branch `legacy_node_layout` is created and checked out.
*   [ ] Legacy injection logic is fully understood and documented.
*   [ ] A comparison between Legacy vs. V2 injection is provided.
*   [ ] A clear "Migration Path" is defined for bringing legacy features into V2.
