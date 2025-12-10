"""
Backend scaffolding for Hikaze Model Manager 2 custom nodes.

- `HikazeBaseNode` is an abstract V3 Comfy node: it defines shared utilities but does
  not implement a schema/execute. Subclasses must override `define_schema` and `execute`
  (and can optionally override `validate_inputs`, `fingerprint_inputs`, `check_lazy_status`).
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from comfy_api.latest import io


class HikazeBaseNode(io.ComfyNode, ABC):
    """Abstract base for Hikaze nodes. Do not register this class directly."""

    @classmethod
    @abstractmethod
    def define_schema(cls) -> io.Schema:
        """Subclasses must return an io.Schema describing inputs/outputs/UI metadata."""
        raise NotImplementedError

    @classmethod
    @abstractmethod
    def execute(cls, **kwargs) -> io.NodeOutput:
        """Subclasses must implement node logic."""
        raise NotImplementedError

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
