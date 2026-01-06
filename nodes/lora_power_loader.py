from __future__ import annotations

import logging
import os
from typing import Any

import comfy.sd
import comfy.utils
import folder_paths
from comfy_api.latest import io

from .base_nodes import HikazeBaseNode, PAYLOAD_WIDGET_NAME
from .util import LoRAListParseError, loads_lora_list_json
from shared.types.lora_list import LoRAListDocument

LOGGER = logging.getLogger(__name__)


def resolve_lora_path(full_path: str) -> str | None:
    drive, _ = os.path.splitdrive(full_path)
    if os.path.isabs(full_path) or drive:
        return full_path if os.path.exists(full_path) else None

    try:
        lora_path = folder_paths.get_full_path("loras", full_path)
    except ValueError as exc:
        LOGGER.warning("HikazeLoraPowerLoader: invalid LoRA path %s: %s", full_path, exc)
        lora_path = None

    if lora_path is None and os.path.exists(full_path):
        lora_path = full_path

    return lora_path


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

        try:
            doc = loads_lora_list_json(hikaze_payload, strict=False)
        except LoRAListParseError as exc:
            LOGGER.warning("HikazeLoraPowerLoader: invalid LoRA list JSON: %s", exc)
            doc = LoRAListDocument(version=2, loras=[])

        current_model = model
        current_clip = clip

        for index, entry in enumerate(doc.loras):
            if entry.enabled is False:
                continue

            full_path = entry.full_path or entry.name
            if not full_path:
                raise ValueError(f"HikazeLoraPowerLoader: Item at index {index} missing 'full_path' or 'name'")

            lora_path = resolve_lora_path(full_path)

            if not lora_path:
                raise ValueError(f"HikazeLoraPowerLoader: LoRA file not found: {full_path}")

            strength_model = float(entry.strength_model)
            strength_clip = float(entry.strength_clip)

            try:
                lora = comfy.utils.load_torch_file(lora_path, safe_load=True)
                current_model, current_clip = comfy.sd.load_lora_for_models(
                    current_model, current_clip, lora, strength_model, strength_clip
                )
                LOGGER.info(
                    "HikazeLoraPowerLoader[%s]: Applied %s (M:%.2f, C:%.2f)",
                    index, full_path, strength_model, strength_clip
                )
            except Exception as exc:
                LOGGER.error(f"HikazeLoraPowerLoader: Failed to apply {full_path}: {exc}")

        return io.NodeOutput(current_model, current_clip)


LOGGER.info("Imported %s from %s", __name__, __file__)
