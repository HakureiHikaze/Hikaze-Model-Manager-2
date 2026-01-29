---
name: hikaze-api
description: API contract and integration work for Hikaze Model Manager 2. Use when adding or changing endpoints, request/response schemas, cross-port access, or frontend-backend payloads.
---

# Hikaze API

## Overview

Use this skill for API contracts and integration between frontend and backend.

## Scope

- Manager API routes and handlers in `backend/server/`.
- Frontend API calls and adapters in `web/model_manager_frontend` and `web/custom_node_frontend`.
- Shared types in `shared/types/` and `web/shared/types/`.

## Workflow

1. Read `.codex/guidelines/api-contracts.md` and `.codex/guidelines/integration-guidelines.md`.
2. Update API contracts with exact request/response schemas from handlers.
3. Keep backend and frontend types in sync; update adapters as needed.
4. Cite evidence with file paths when describing behavior.
5. Run build at phase end before user verification (per workflow).

## Guardrails

- Do not assume schemas; derive from handlers and types.
- Avoid changing `.codex/constitution` unless explicitly instructed.
