---
name: hikaze-frontend
description: Frontend UI/UX work for Hikaze Model Manager 2. Use when editing Vue/TypeScript/CSS in web/model_manager_frontend or web/custom_node_frontend, manager layouts, modals, overlays, library/detail components, or Vite build behavior.
---

# Hikaze Frontend

## Overview

Use this skill for frontend changes in the standalone manager or embedded node UI.

## Scope

- Vue components under `web/model_manager_frontend` and `web/custom_node_frontend`.
- Frontend state, caches, modal flows, and overlays.
- Layout, styling, and interaction changes.

## Workflow

1. Read `.codex/constitution/product.md` and `.codex/guidelines/product-guidelines.md`.
2. Use `.codex/guidelines/architecture-index.md` to locate entry files.
3. If UI or interaction changes, update the relevant guideline files (e.g., `lora-power-loader.md`, `fullscreen-toolbar.md`, `terminology.md`).
4. Cite evidence with file paths when describing behavior.
5. Run build at phase end before user verification (per workflow).

## Guardrails

- Keep node canvas labels in English.
- Avoid changing `.codex/constitution` unless explicitly instructed.
