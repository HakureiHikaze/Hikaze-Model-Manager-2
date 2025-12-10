"""
Hikaze Model Manager 2 - custom ComfyUI node scaffold.

This module registers a ComfyExtension entrypoint so the project is discoverable.
Node implementations should live in this package and be returned from
HikazeModelManagerExtension.get_node_list().
"""

from comfy_api.latest import ComfyExtension, io

from .checkpoint_loader import HikazeCheckpointLoader


class HikazeModelManagerExtension(ComfyExtension):
    async def on_load(self) -> None:
        """
        Place any one-time initialization here (e.g., scanning models, warming caches).
        """

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        """
        Return a list of io.ComfyNode subclasses to expose to ComfyUI.
        """
        return [
            HikazeCheckpointLoader,
        ]


async def comfy_entrypoint() -> ComfyExtension:
    """
    Entry point called by ComfyUI when loading custom nodes.
    """
    return HikazeModelManagerExtension()
