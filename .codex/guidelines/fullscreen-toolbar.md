# Fullscreen Manager Toolbar Guidelines

- Standalone manager runs fullscreen by default; no fullscreen/restore toggle in standalone mode.
- Embedded manager (opened from a node) provides a fullscreen toggle in the modal title bar; the title bar remains visible in fullscreen.
- Floating toolbar appears only in standalone fullscreen mode; do not render it in embedded fullscreen.
- Floating toolbar is draggable within fullscreen bounds; default position is bottom-center; remember position for the current session only.
- Toolbar visuals: dark palette, translucent background, drop shadow.
- Fullscreen toggle icon: use window-restore icon U+1F5D7.
- Floating toolbar receives the active tab value for future button actions.
