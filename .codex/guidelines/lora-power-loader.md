# LoRA Power Loader Selection Guidelines

- Open manager from node in LoRA-only mode with tabs hidden (embedded + initialTab).
- Show a Selected LoRA bar below the modal title, above filters, left of details.
- SelectedLoraBar layout: single-row, six equal columns; overflow horizontally when more than six; keep card-style even in list view; match ModelLibrary card styling with static preview (no carousel).
- Card/list click selects (if not selected) and updates details; checkbox toggles selection without changing details.
- Unselect is only via checkbox; selected items are excluded from the library list.
- Title bar includes a "Clear selection" action that empties selected items without closing the modal.
- Filters/sorting apply only to the library list, not the selected list.
- On confirm, parse payload JSON into LoRAListDocument, keep original entries for matching sha256 to preserve strengths, and add/remove sha256 deltas as needed.
