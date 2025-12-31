from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class LoRAEntry:
    """
    A single LoRA record used by Hikaze nodes.
    """

    full_path: str
    strength_model: float
    strength_clip: float
    enabled: bool

    name: str
    sha256: str


@dataclass(frozen=True, slots=True)
class LoRAListDocument:
    """
    Top-level LoRA list JSON document.

    Maps to `loraListExample.json`:
      {"version": 1, "LoRAList": [ ... ]}
    """

    version: int=2
    loras: list[LoRAEntry]
