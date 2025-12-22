from __future__ import annotations

import os
import logging

import comfy.sd
import folder_paths
from comfy_api.latest import io

from .base_nodes import HikazeBaseNode, PAYLOAD_WIDGET_NAME


class HikazeCheckpointLoader(HikazeBaseNode):
    """
    Minimal checkpoint loader that takes an absolute path string (from the front-end prompt)
    and returns Model / CLIP / VAE, mirroring the classic loader behavior.
    """

    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="HikazeCheckpointLoader",
            display_name="Hikaze Checkpoint Loader",
            category="Hikaze Model Manager 2 nodes",
            description="Load a diffusion checkpoint by absolute path (Model / CLIP / VAE).",
            inputs=[
                cls.create_payload_input(default='{"ckpt_path": ""}'),
            ],
            outputs=[
                io.Model.Output(id="model", display_name="Model"),
                io.Clip.Output(id="clip", display_name="CLIP"),
                io.Vae.Output(id="vae", display_name="VAE"),
            ],
        )

    @classmethod
    def execute(cls, **kwargs) -> io.NodeOutput:
        hikaze_payload = kwargs.get(PAYLOAD_WIDGET_NAME, "{}")
        payload = cls.parse_payload(hikaze_payload)
        
        # Extract path from structured payload
        if isinstance(payload, dict):
            ckpt_path = payload.get("ckpt_path", "")
        else:
            ckpt_path = ""

        if not ckpt_path:
            raise ValueError("Checkpoint path is empty. Please select a checkpoint file.")

        expanded = os.path.abspath(os.path.expanduser(ckpt_path))
        if not os.path.isfile(expanded):
            raise FileNotFoundError(f"Checkpoint not found: {expanded}")

        logging.info(f"HikazeCheckpointLoader: loading checkpoint from {expanded}")
        model, clip, vae, *_ = comfy.sd.load_checkpoint_guess_config(
            expanded,
            output_vae=True,
            output_clip=True,
            embedding_directory=folder_paths.get_folder_paths("embeddings"),
        )
        return io.NodeOutput(model, clip, vae)
