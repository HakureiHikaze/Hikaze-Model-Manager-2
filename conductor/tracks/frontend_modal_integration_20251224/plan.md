# Track Plan: Frontend Model Manager Integration

## Phase 1: Global Modal Service

- [ ] Task: Implement Provide/Inject Modal Service
  - Sub-tasks:
    - [ ] Update `web/src/injection/manager.ts` or a new root component to provide `openManager`.
    - [ ] Create a modal state manager (ref-based) to handle visibility and options.
    - [ ] Implement a Promise-based `openManager` that resolves on "Confirm" and rejects/resolves null on "Cancel".

- [ ] Task: Create HikazeManagerModal Wrapper
  - Sub-tasks:
    - [ ] Create `HikazeManagerModal.vue` to wrap the layout in a full-screen container.
    - [ ] Handle z-index and backdrop to ensure it covers ComfyUI.

- [ ] Task: Conductor - User Manual Verification 'Global Modal Service' (Protocol in workflow.md)

## Phase 2: Model Manager UI Updates

- [ ] Task: Update Filter Bar Layout
  - Sub-tasks:
    - [ ] Move search input to center via CSS/Template changes.
    - [ ] Add "Confirm" and "Cancel" buttons.

- [ ] Task: Implement Multi-Select Logic in ModelLibrary
  - Sub-tasks:
    - [ ] Add `multiSelect` prop to `ModelLibrary.vue`.
    - [ ] Implement selection state (array of SHA256).
    - [ ] Add checkbox rendering logic to `HikazeLoraListElement.vue` (or the equivalent grid card).
    - [ ] Ensure selection order is preserved.

- [ ] Task: Conductor - User Manual Verification 'Model Manager UI Updates' (Protocol in workflow.md)

## Phase 3: Node Controller Integration

- [ ] Task: Update Checkpoint Loader Controller
  - Sub-tasks:
    - [ ] Inject `openManager` into the overlay/controller.
    - [ ] Wire the "Select Checkpoint" button to trigger the modal.
    - [ ] Handle the returned path and call `setWidgetValue`.

- [ ] Task: Update LoRA Power Loader Controller
  - Sub-tasks:
    - [ ] Wire the "Select LoRA" button to trigger the modal with `multiSelect: true`.
    - [ ] Implement the `LoRAListDocument` v2 formatting logic for returned data.
    - [ ] Call `setWidgetValue` with the resulting JSON string.

- [ ] Task: Conductor - User Manual Verification 'Node Controller Integration' (Protocol in workflow.md)
