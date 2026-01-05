# Specification: Frontend Data Structure Refactor & Unification

## Overview
This track aims to mirror the data integrity standards established in the backend (refactor 2025-12-31) within the frontend codebases. We will eliminate anonymous data structures and scattered interface definitions in favor of a centralized, shared type system and a robust "Data Adapter" layer. This ensures that all data flowing through the application logic is strictly typed and adheres to a "No Null/Undefined" policy.

## Scope
- **Projects:** `web/model_manager_frontend` and `web/custom_node_frontend`.
- **Location:** A new centralized directory `web/shared` will house the unified TypeScript interfaces and data adapters.

## Functional Requirements
1. **Centralized Type Definition:** 
   - Move all core data models (Models, Tags, LoRA lists) to `web/shared/types`.
   - Use `web/model_manager_frontend/src/types` as the initial baseline.
   - Enforce a "No None/Null" policy: Use `""` for strings, `0` for numbers, `false` for booleans, and empty objects for nested structures.
2. **Data Adapter Layer:**
   - Implement conversion functions in `web/shared/adapters` that transform raw backend responses into strictly typed frontend objects immediately upon receipt.
   - These adapters will handle default value injection.
3. **Internal Logic Unification:**
   - Replace all anonymous dictionaries and inline interfaces with the unified types.
   - Ensure component props, event payloads, and internal state (reactive/ref) use these types.
4. **Shared Access:**
   - Configure Vite/TypeScript in both frontend projects to recognize and import from the `web/shared` directory.

## Non-Functional Requirements
- **Modularity:** Types and adapters should be organized by domain (e.g., `models.ts`, `loras.ts`).
- **Maintainability:** Avoid redundant type declarations; use inheritance/intersection where appropriate.
- **Robustness:** The "No Null" policy must be enforced at the entry point (adapters).
- **Build Stability:** The codebase must remain buildable (`npm run build`) at the end of each refactoring phase.

## Process & Verification
- **Phase Completion Protocol:**
  1. **Build Check:** Execute `npm run build` for the relevant frontend(s).
  2. **Fix Loop:** If the build fails, fix issues until it succeeds.
  3. **User Verification:** Pause for explicit user verification of the functionality. (Note: Distinguish actual user input from automated CLI commands).

## Acceptance Criteria
- [ ] `web/shared` directory is established and accessible by both frontend projects.
- [ ] No raw `fetch().json()` data is used directly in components without passing through an adapter.
- [ ] Zero instances of `any` or anonymous `{ [key: string]: ... }` in the core data flow logic.
- [ ] All components in both frontends successfully build using the unified types.
- [ ] Data integrity is maintained (no crashes due to missing fields or `undefined`).
