# Terminology

Use these terms consistently in code, docs, and discussions.

- **Manager (standalone)**: Fullscreen model manager UI (`web/model_manager_frontend`).
- **Embedded manager**: Modal manager opened from a node (`HikazeManagerModal.vue`).
- **Library**: Left pane model list with search, filters, and card/list views.
- **Details panel**: Right pane inspector/editor for a single model.
- **ModelSimpleRecord**: Lightweight list record used in the library.
- **ModelRecord / ModelFull**: Full record used in the details panel.
- **PendingModelRecord**: Legacy/migration record not yet promoted.
- **SelectedLoraBar**: Single-row bar listing selected LoRAs in embedded mode.
- **hikaze_payload**: Hidden widget value persisted in the node schema.
- **payloadJson**: Modal option string used to hydrate selection state.
- **LoRAListDocument**: Versioned JSON payload containing LoRA entries.
- **Active vs Pending**: Active is the main library; Pending is the migration queue.
