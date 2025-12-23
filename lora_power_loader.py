from __future__ import annotations

import logging
import os
from typing import Any

import comfy.sd
import comfy.utils
import folder_paths
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
            
        current_model = model
        current_clip = clip

        if isinstance(entries, list):
            for index, item in enumerate(entries):
                if not isinstance(item, dict):
                    continue
                
                # Check enabled status (defaulting to True if missing)
                enabled = item.get("enabled", True)
                if enabled is False:
                    continue

                # Resolve Name / Path
                name = item.get("name")
                full_path = item.get("full_path") or item.get("path") or name
                
                if not full_path:
                    raise ValueError(f"HikazeLoraPowerLoader: Item at index {index} missing 'full_path' or 'name'")

                lora_path = None
                # 1. Try standard ComfyUI resolution
                lora_path = folder_paths.get_full_path("loras", full_path)
                
                # 2. Try absolute path if resolution failed
                if lora_path is None and os.path.exists(full_path):
                    lora_path = full_path
                        
                if not lora_path:
                    raise ValueError(f"HikazeLoraPowerLoader: LoRA file not found: {full_path}")

                # Resolve Strengths
                strength_model = float(item.get("strength_model", 1.0))
                strength_clip = float(item.get("strength_clip", 1.0))

                # Load and Apply
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
