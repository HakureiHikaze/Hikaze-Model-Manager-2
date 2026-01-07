---
name: hikaze-frontend-polish
description: Small-scope frontend polish and quick UI refinements for Hikaze Model Manager 2. Use when the user requests minor UI/UX tweaks, styling adjustments, or localized frontend fixes and wants a simplified job-task-only workflow with build as the second-to-last task and user verification as the last task.
---

# Hikaze Frontend Polish

## Overview

Use this skill for small, localized frontend polish tasks with a simplified job-task workflow.

## Scope

- Vue/TypeScript/CSS edits under `web/model_manager_frontend` or `web/custom_node_frontend`.
- Minor UI fixes, visual tuning, micro-interactions, and layout tweaks.

## Out of scope

- Large feature work, multi-area refactors, or backend changes. Escalate to `hikaze-frontend` or `root`. Before the escalation you MUST verify the plan with user.

## Sources of truth

1. `.codex/constitution/product.md`
2. `.codex/guidelines/product-guidelines.md`
3. `.codex/guidelines/architecture-index.md`
4. `.codex/jobs/activated.md` and the active job file

## Workflow (job-task only)

1. Create or update a job file at `.codex/jobs/<job>/<job>.md`.
2. Track only tasks (no phases or branches). The final two tasks must be:
   - Build (second-to-last): `npm run build` in the relevant frontend(s).
   - User manual verification (last).
3. Prompt the user with clear manual verification steps at the end.

## Job format

```markdown
# Job: <job-name>
- [ ] Task: <short task>
- [ ] Task: <short task>
- [ ] Task: Build (npm run build in <path>)
- [ ] Task: User manual verification
```

## Evidence and docs

- Cite evidence (file paths + line refs or command output) in responses.
- Update `.codex/guidelines/` for new UI behavior or decisions.
- Record deferred items in `.codex/guidelines/not_implemented.md`.

## Guardrails

- Do not edit `.codex/constitution/` or `.codex/workflows/` unless explicitly requested.
- Keep node canvas labels in English.
- Use ASCII unless the file already uses Unicode.

## Language policy

Accept any input language. Choose output language by accuracy first, then token efficiency.
