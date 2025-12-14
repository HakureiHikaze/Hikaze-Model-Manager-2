"""
Backend scaffolding for Hikaze Model Manager 2 custom nodes.

- `HikazeBaseNode` is an abstract V3 Comfy node: it defines shared utilities but does
  not implement a schema/execute. Subclasses must override `define_schema` and `execute`
  (and can optionally override `validate_inputs`, `fingerprint_inputs`, `check_lazy_status`).
"""

from __future__ import annotations

from typing import Any

from comfy_api.latest import io


class HikazeBaseNode(io.ComfyNode):
    """
    Base class for Hikaze V3 nodes.

    IMPORTANT: Do not inherit from `abc.ABC` here.
    ComfyUI V3 clones and "locks" node classes at runtime to prevent monkey-patching;
    `ABCMeta` needs to set `__abstractmethods__` during class creation, which conflicts
    with the locking mechanism and will break prompt validation/execution.

    Subclasses must still override `define_schema` and `execute` (inherited from `io.ComfyNode`).
    """

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
