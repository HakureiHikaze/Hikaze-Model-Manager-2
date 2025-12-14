"""
Hikaze Model Manager 2 - custom ComfyUI node scaffold.

This module registers a ComfyExtension entrypoint so the project is discoverable.
Node implementations should live in this package and be returned from
HikazeModelManagerExtension.get_node_list().
"""

import logging

from comfy_api.latest import ComfyExtension, io

from .checkpoint_loader import HikazeCheckpointLoader
from .lora_power_loader import HikazeLoraPowerLoader

LOGGER = logging.getLogger(__name__)


class HikazeModelManagerExtension(ComfyExtension):
    async def on_load(self) -> None:
        """
        Place any one-time initialization here (e.g., scanning models, warming caches).
        """
        LOGGER.info("HikazeModelManagerExtension.on_load from %s", __file__)

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        """
        Return a list of io.ComfyNode subclasses to expose to ComfyUI.
        """
        node_list = [
            HikazeCheckpointLoader,
            HikazeLoraPowerLoader,
        ]
        LOGGER.info(
            "HikazeModelManagerExtension.get_node_list from %s -> %s",
            __file__,
            [getattr(n, "__name__", str(n)) for n in node_list],
        )
        return node_list


async def comfy_entrypoint() -> ComfyExtension:
    """
    Entry point called by ComfyUI when loading custom nodes.
    """
    LOGGER.info("comfy_entrypoint called from %s", __file__)
    return HikazeModelManagerExtension()
