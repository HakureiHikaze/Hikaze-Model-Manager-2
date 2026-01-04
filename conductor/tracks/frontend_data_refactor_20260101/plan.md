# Plan: Frontend Data Structure Refactor & Unification

## Phase 1: Shared Foundation & Baseline Analysis [checkpoint: 4fd3bf0]
- [x] Task: Create centralized structure in `web/shared/types` and `web/shared/adapters`.
- [x] Task: Analyze current types in `web/model_manager_frontend/src/types` and migrate as the "Gold Standard".
- [x] Task: Analyze anonymous structures and internal types in both frontends for abstraction opportunities.
- [x] Task: Propose updated/unified interfaces to the user for confirmation.
- [x] Task: Configure `tsconfig.json` and Vite in both frontend projects to support `@shared` (or relative) imports from `web/shared`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Foundation' (Protocol in workflow.md)

## Phase 2: Type Unification & Cleanup [checkpoint: efef688]
- [x] Task: Scan `web/model_manager_frontend` for scattered/local interfaces and replace with shared types.
- [x] Task: Scan `web/custom_node_frontend` for scattered/local interfaces and replace with shared types.
- [x] Task: Update component props, emits, and internal reactive states to use unified types.
- [x] Task: Verify build stability for both frontends (`npm run build`).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Type Unification' (Protocol in workflow.md)

## Phase 2.5: Backend Migration Repair (Images & Counts) [checkpoint: 5616cb1]
- [x] Task: Investigate Stage 1 migration logic to identify why `images_count` is 0 and images are not processed.
- [x] Task: Fix the legacy importer to correctly process `images[]` from legacy metadata.
- [x] Task: Implement/Verify image compression logic (3 sizes) for migrated images.
- [x] Task: Update the `images_count` field in the main database table during migration.
- [x] Task: Verify the fix by running a test migration and checking database/filesystem.
- [x] Task: Conductor - User Manual Verification 'Phase 2.5: Backend Migration Repair' (Protocol in workflow.md)

## Phase 3: Data Adapter Implementation [checkpoint: af8795e]
- [x] Task: Implement adapters in `web/shared/adapters` for all core entities (Models, Tags, LoRA Lists).
- [x] Task: Ensure adapters enforce the "No Null/Undefined" policy (injecting `""`, `0`, `false`).
- [x] Task: Implement high-frequency conversion logic (e.g., raw backend JSON to `ModelRecord`).
- [x] Task: Verify build stability for both frontends (`npm run build`).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Data Adapters' (Protocol in workflow.md)

## Phase 4: Integration & Final Integrity
- [ ] Task: Refactor API calling layers in both frontends to use the new adapters immediately after fetching data.
- [ ] Task: Remove any remaining manual data mapping logic in components.
- [ ] Task: Final comprehensive build check for both projects.
- [ ] Task: Perform manual functional verification of the Model Manager and Custom Nodes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Integration' (Protocol in workflow.md)
