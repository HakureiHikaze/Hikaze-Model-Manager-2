# Architecture Index

Use this index to locate the correct files quickly and reduce repeated discovery.

## Frontend (standalone manager)
- `web/model_manager_frontend/src/App.vue`: standalone manager entry.
- `web/model_manager_frontend/src/components/HikazeManagerLayout.vue`: layout + tabs + details pane.
- `web/model_manager_frontend/src/components/ModelLibrary.vue`: library list, filters, grid/list views.
- `web/model_manager_frontend/src/components/ModelDetails.vue`: details editor panel.
- `web/model_manager_frontend/src/components/PendingModelLibrary.vue`: pending list, filters, grid/list views.
- `web/model_manager_frontend/src/components/PendingModelDetails.vue`: pending read-only details panel.
- `web/model_manager_frontend/src/components/SelectedLoraBar.vue`: selected LoRA bar (embedded view).
- `web/model_manager_frontend/src/components/FloatingToolbar.vue`: standalone floating toolbar.
- `web/model_manager_frontend/src/cache/*`: model, tag, and image caches.

## Frontend (embedded / node UI)
- `web/custom_node_frontend/extensions/hikaze-model-manager.js`: ComfyUI extension entry.
- `web/custom_node_frontend/src/injection/manager.ts`: injection manager.
- `web/custom_node_frontend/src/injection/controllers/*`: node controllers.
- `web/custom_node_frontend/src/components/HikazeManagerModal.vue`: embedded manager modal.
- `web/custom_node_frontend/src/components/HikazeLoraPowerLoaderOverlay.vue`: LoRA overlay.
- `web/custom_node_frontend/src/injection/modalService.ts`: modal state + openManager.

## Backend
- `__init__.py`: ComfyUI entrypoint + node list.
- `nodes/*`: node schemas and execution.
- `backend/server/router.py`: manager API routes.
- `backend/server/instance.py`: Hikaze server startup and port handling.
- `backend/server/images_handler.py`: image endpoints.
- `backend/server/migration_handler.py`: migration endpoints.

## Shared types
- `shared/types/*.py`: backend data contracts.
- `web/shared/types/*.ts`: frontend data contracts.
- `web/shared/adapters/*`: parsing and normalization.
