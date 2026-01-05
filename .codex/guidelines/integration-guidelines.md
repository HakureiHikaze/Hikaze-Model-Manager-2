# Integration Guidelines

## Hikaze API Port Discovery
- Register a ComfyUI-side route at `/api/hikaze/sniffer_port` to return the current HikazeServer port.
- Frontend should call the ComfyUI route (same origin) to obtain the port, then build the Hikaze API base URL.
- Do not use file-based port exchange.
- Hikaze backend must allow CORS for cross-port API calls.
