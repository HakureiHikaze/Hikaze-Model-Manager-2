from __future__ import annotations

import os
import logging

import comfy.sd
import folder_paths
from comfy_api.latest import io

from .base_nodes import HikazeBaseNode


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
            category="loaders",
            description="Load a diffusion checkpoint by absolute path (Model / CLIP / VAE).",
            inputs=[
                io.String.Input(
                    id="ckpt_path",
                    display_name="Checkpoint Path",
                    default="",
                    socketless=True,
                    tooltip="Absolute path to the checkpoint. Click the overlay to choose.",
                    extra_dict={"placeholder": "Click to select", "readonly": True},
                ),
            ],
            outputs=[
                io.Model.Output(id="model", display_name="Model"),
                io.Clip.Output(id="clip", display_name="CLIP"),
                io.Vae.Output(id="vae", display_name="VAE"),
            ],
        )

    @classmethod
    def execute(cls, ckpt_path: str) -> io.NodeOutput:
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
