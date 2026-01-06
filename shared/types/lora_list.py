from __future__ import annotations

from dataclasses import dataclass, field


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
      {"version": 2, "loras": [ ... ]}
    """

    loras: list[LoRAEntry] = field(default_factory=list)
    version: int = 2
