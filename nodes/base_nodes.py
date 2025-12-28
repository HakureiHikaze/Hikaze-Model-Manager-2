"""
Backend scaffolding for Hikaze Model Manager 2 custom nodes.

- `HikazeBaseNode` is an abstract V3 Comfy node.
- It enforces a standard JSON payload input for frontend-backend communication.
"""

from __future__ import annotations

import json
from typing import Any, Dict, Optional

from comfy_api.latest import io

# The name of the hidden string widget used for structured data exchange.
PAYLOAD_WIDGET_NAME = "hikaze_payload"


class HikazeBaseNode(io.ComfyNode):
    """
    Base class for Hikaze V3 nodes.

    Subclasses should:
    1. Call `HikazeBaseNode.create_payload_input()` in their `define_schema`.
    2. Accept `hikaze_payload` in their `execute` method (or handle it via `**kwargs`).
    """

    @staticmethod
    def create_payload_input(default: str = "{}") -> io.String.Input:
        """
        Create the standard payload input definition.
        This input is hidden/socketless and used by the frontend to sync state.
        """
        return io.String.Input(
            id=PAYLOAD_WIDGET_NAME,
            display_name="Hikaze Payload",
            default=default,
            multiline=True,
            socketless=True,
            # We might want to hide this in the future, but for now it's visible for debug
            # or implicitly hidden by the overlay.
            tooltip="Internal structured data payload.",
        )

    @staticmethod
    def parse_payload(payload: str) -> Any:
        """Helper to safely parse the JSON payload."""
        raw = (payload or "").strip()
        if not raw:
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    # Optional hooks: subclasses may override as needed
    @classmethod
    def validate_inputs(cls, **kwargs) -> bool | str:
        return True

    @classmethod
    def fingerprint_inputs(cls, **kwargs) -> Any:
        return None

    @classmethod
    def check_lazy_status(cls, **kwargs) -> list[str]:
        return [name for name, value in kwargs.items() if value is None]
