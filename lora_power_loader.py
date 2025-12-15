from __future__ import annotations

import json
import logging
from typing import Any

from comfy_api.latest import io

from .base_nodes import HikazeBaseNode

LOGGER = logging.getLogger(__name__)


class HikazeLoraPowerLoader(HikazeBaseNode):
    """
    Placeholder node: apply multiple LoRAs (with per-model/per-CLIP strengths) to a Model/CLIP.

    - Inputs:
      - model (socket)
      - clip  (socket)
      - lora_json (socketless widget): JSON string describing LoRA entries
    - Outputs:
      - model
      - clip

    Actual LoRA application logic will be implemented later; for now this node is a pass-through
    that validates/parses JSON and logs the requested operations.
    """

    @classmethod
    def define_schema(cls) -> io.Schema:
        LOGGER.info("%s.define_schema called", cls.__name__)
        return io.Schema(
            node_id="HikazeLoraPowerLoader",
            display_name="Hikaze LoRA Power Loader",
            category="Hikaze Model Manager 2 nodes",
            description="Apply a list of LoRAs (name/model/clip strength, enabled) to Model/CLIP.",
            inputs=[
                io.Model.Input(id="model", display_name="Model"),
                io.Clip.Input(id="clip", display_name="CLIP"),
                io.String.Input(
                    id="lora_json",
                    display_name="LoRA JSON",
                    default="[]",
                    multiline=True,
                    socketless=True,
                    placeholder='[{"name":"lora.safetensors","strength_model":1.0,"strength_clip":1.0,"enabled":true}]',
                    tooltip="JSON describing LoRA entries; the front-end UI writes this field.",
                ),
            ],
            outputs=[
                io.Model.Output(display_name="Model"),
                io.Clip.Output(display_name="CLIP"),
            ],
        )

    @classmethod
    def execute(cls, model: Any, clip: Any, lora_json: str) -> io.NodeOutput:
        parsed: Any
        raw = (lora_json or "").strip()

        if not raw:
            parsed = []
        else:
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid LoRA JSON: {exc}") from exc

        # Placeholder: log the intended operations; do not modify model/clip yet.
        entries = parsed.get("loras") if isinstance(parsed, dict) else parsed
        if isinstance(entries, list):
            for index, item in enumerate(entries):
                if not isinstance(item, dict):
                    continue
                name = item.get("name")
                strength_model = item.get("strength_model")
                strength_clip = item.get("strength_clip")
                enabled = item.get("enabled", True)
                LOGGER.info(
                    "HikazeLoraPowerLoader[%s]: %s model=%s clip=%s enabled=%s",
                    index,
                    name,
                    strength_model,
                    strength_clip,
                    enabled,
                )

        return io.NodeOutput(model, clip)


LOGGER.info("Imported %s from %s", __name__, __file__)
