---
name: hikaze-backend
description: Backend Python work for Hikaze Model Manager 2. Use when editing nodes/, backend/server/, shared/types/*.py, migrations, path resolution, or ComfyUI integration behavior.
---

# Hikaze Backend

## Overview

Use this skill for backend node logic and the manager server.

## Scope

- Node schemas and execution in `nodes/`.
- Server routes and services in `backend/server/`.
- Shared Python types in `shared/types/`.

## Workflow

1. Read `.codex/constitution/tech-stack.md` and `.codex/guidelines/architecture-index.md`.
2. If API behavior changes, update `.codex/guidelines/api-contracts.md`.
3. Record unresolved design items in `.codex/guidelines/not_implemented.md`.
4. Cite evidence with file paths when describing behavior.
5. Run build at phase end before user verification (per workflow).

## Guardrails

- Keep backend logs and error text in English.
- Avoid modifying `.codex/constitution` unless explicitly instructed.
