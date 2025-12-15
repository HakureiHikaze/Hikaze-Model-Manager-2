from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class LoRAEntry:
    """
    A single LoRA record used by Hikaze nodes.

    This is the Python-side canonical representation; JSON key mapping is handled by
    `util.lora_list_parser` to match `loraListExample.json`:
      - `strength_model` <-> `MStrength`
      - `strength_clip`  <-> `CStrength`
      - `enabled`        <-> `toggleOn`
      - `loras`          <-> `LoRAList`
    """

    full_path: str
    strength_model: float
    strength_clip: float
    enabled: bool

    name: str | None = None
    sha256: str | None = None


@dataclass(frozen=True, slots=True)
class LoRAListDocument:
    """
    Top-level LoRA list JSON document.

    Maps to `loraListExample.json`:
      {"version": 1, "LoRAList": [ ... ]}
    """

    version: int
    loras: list[LoRAEntry]
