# Decisions Log

Record durable decisions here to prevent re-litigating settled choices.
Format:

```
## YYYY-MM-DD: <title>
- Context:
- Decision:
- Rationale:
- References:
```

## 2026-01-06: Build before user verification at phase end
- Context: Build verification should not be a separate phase.
- Decision: Run `npm run build` at phase completion before user verification and fix build errors first.
- Rationale: Keeps phases atomic while enforcing build quality at the correct time.
- References: `.codex/workflows/default.md`

## 2026-01-06: Port discovery via ComfyUI route
- Context: Avoid file-based port exchange and cross-process guessing.
- Decision: Register a ComfyUI route at `/api/hikaze/sniffer_port` and have the frontend query it.
- Rationale: Same-origin access, lower failure rate, less state drift.
- References: `.codex/guidelines/integration-guidelines.md`

## 2026-01-06: Pending mode details and conflict handling
- Context: Pending import UI needs safe, read-only inspection and conflict resolution.
- Decision: Use `GET /api/migration/pending_model?id=<id>` for read-only details and `GET /api/images/pending/{id}` for original image preview; hide pending badge when count is zero; keep search/filter active in Pending mode.
- Decision: Initial import call sends `conflict_strategy: null`; if conflicts exist, prompt for strategy and re-submit only the conflict items.
- Rationale: Avoids accidental edits to pending data and gives explicit user control over conflicts.
- References: `.codex/guidelines/pending-model-mode.md`, `.codex/guidelines/api-contracts.md`
