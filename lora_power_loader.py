from __future__ import annotations

import logging
from typing import Any

from comfy_api.latest import io

from .base_nodes import HikazeBaseNode, PAYLOAD_WIDGET_NAME

LOGGER = logging.getLogger(__name__)


class HikazeLoraPowerLoader(HikazeBaseNode):
    """
    Apply multiple LoRAs (with per-model/per-CLIP strengths) to a Model/CLIP.
    
    Inputs:
      - model (socket)
      - clip  (socket)
      - hikaze_payload (socketless widget): JSON string describing LoRA entries
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
                cls.create_payload_input(default="[]"),
            ],
            outputs=[
                io.Model.Output(display_name="Model"),
                io.Clip.Output(display_name="CLIP"),
            ],
        )

    @classmethod
    def execute(cls, model: Any, clip: Any, **kwargs) -> io.NodeOutput:
        # Use kwargs to catch the payload by name, in case the variable name changes.
        hikaze_payload = kwargs.get(PAYLOAD_WIDGET_NAME, "[]")
        parsed = cls.parse_payload(hikaze_payload)

        # Logic to iterate over LoRAs
        if isinstance(parsed, list):
            entries = parsed
        elif isinstance(parsed, dict):
            # Support various legacy formats if needed, or standard format
            entries = (
                parsed.get("LoRAs")
                or parsed.get("LoRAList")
                or parsed.get("loras")
                or []
            )
        else:
            entries = []

        if isinstance(entries, list):
            for index, item in enumerate(entries):
                if not isinstance(item, dict):
                    continue
                name = item.get("name")
                full_path = item.get("full_path") or item.get("fullPath") or item.get("path") or name

                strength_model = item.get("strength_model")
                if strength_model is None:
                    strength_model = item.get("MStrength")

                strength_clip = item.get("strength_clip")
                if strength_clip is None:
                    strength_clip = item.get("CStrength")

                enabled = item.get("enabled")
                if enabled is None:
                    enabled = item.get("toggleOn")
                if enabled is None:
                    enabled = True
                    
                LOGGER.info(
                    "HikazeLoraPowerLoader[%s]: %s (%s) model=%s clip=%s enabled=%s",
                    index,
                    name,
                    full_path,
                    strength_model,
                    strength_clip,
                    enabled,
                )

        return io.NodeOutput(model, clip)


LOGGER.info("Imported %s from %s", __name__, __file__)
