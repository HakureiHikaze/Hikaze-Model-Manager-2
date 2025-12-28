from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .dataclasses import LoRAEntry, LoRAListDocument


class LoRAListParseError(ValueError):
    pass


SUPPORTED_LORA_LIST_VERSION = 1


def _require_dict(value: Any, ctx: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise LoRAListParseError(f"{ctx} must be an object")
    return value


def _require_list(value: Any, ctx: str) -> list[Any]:
    if not isinstance(value, list):
        raise LoRAListParseError(f"{ctx} must be an array")
    return value


def _coerce_int(value: Any, ctx: str) -> int:
    if isinstance(value, bool):
        raise LoRAListParseError(f"{ctx} must be an integer")
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        s = value.strip()
        if s.isdigit():
            return int(s)
    raise LoRAListParseError(f"{ctx} must be an integer")


def _coerce_str(value: Any, ctx: str) -> str:
    if not isinstance(value, str):
        raise LoRAListParseError(f"{ctx} must be a string")
    return value


def _coerce_bool(value: Any, ctx: str) -> bool:
    if not isinstance(value, bool):
        raise LoRAListParseError(f"{ctx} must be a boolean")
    return value


def _coerce_float(value: Any, ctx: str) -> float:
    if isinstance(value, bool):
        raise LoRAListParseError(f"{ctx} must be a number")
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value.strip())
        except ValueError:
            pass
    raise LoRAListParseError(f"{ctx} must be a number")


def _normalize_sha256(value: str) -> str:
    return value.strip().lower()


def parse_lora_list_json(data: dict[str, Any], *, strict: bool = True) -> LoRAListDocument:
    """
    Parse the LoRA list JSON document according to `loraListExample.json`.

    Expected shape (v1):
      {
        "version": 1,
        "LoRAList": [
          {
            "name": "example",
            "full_path": "path",
            "MStrength": 1.0,
            "CStrength": 1.0,
            "sha256": "...",
            "toggleOn": true
          }
        ]
      }

    If `strict` is False, this parser also accepts common alternative spellings:
      - "loras" or "loRAList" instead of "LoRAList"
      - "enabled" instead of "toggleOn"
      - "strength_model"/"strength_clip" instead of "MStrength"/"CStrength"
    """
    root = _require_dict(data, "LoRA list document")

    version_raw = root.get("version", None)
    if version_raw is None:
        raise LoRAListParseError("Missing required field: version")
    version = _coerce_int(version_raw, "version")
    if version != SUPPORTED_LORA_LIST_VERSION:
        raise LoRAListParseError(
            f"Unsupported LoRA list version: {version} (supported: {SUPPORTED_LORA_LIST_VERSION})"
        )

    list_key = "LoRAList"
    if not strict:
        if "LoRAList" in root:
            list_key = "LoRAList"
        elif "loRAList" in root:
            list_key = "loRAList"
        elif "loras" in root:
            list_key = "loras"

    if list_key not in root:
        raise LoRAListParseError(f"Missing required field: {list_key}")

    raw_list = _require_list(root.get(list_key), list_key)
    loras: list[LoRAEntry] = []

    for idx, item in enumerate(raw_list):
        obj = _require_dict(item, f"{list_key}[{idx}]")

        name = obj.get("name", None)
        if name is not None:
            name = _coerce_str(name, f"{list_key}[{idx}].name")

        full_path = _coerce_str(obj.get("full_path", None), f"{list_key}[{idx}].full_path")

        if strict:
            strength_model = _coerce_float(obj.get("MStrength", None), f"{list_key}[{idx}].MStrength")
            strength_clip = _coerce_float(obj.get("CStrength", None), f"{list_key}[{idx}].CStrength")
            enabled = _coerce_bool(obj.get("toggleOn", None), f"{list_key}[{idx}].toggleOn")
        else:
            strength_model = _coerce_float(
                obj.get("MStrength", obj.get("strength_model", None)),
                f"{list_key}[{idx}].MStrength",
            )
            strength_clip = _coerce_float(
                obj.get("CStrength", obj.get("strength_clip", None)),
                f"{list_key}[{idx}].CStrength",
            )
            enabled = _coerce_bool(
                obj.get("toggleOn", obj.get("enabled", None)),
                f"{list_key}[{idx}].toggleOn",
            )

        sha256 = obj.get("sha256", None)
        if sha256 is not None:
            sha256 = _normalize_sha256(_coerce_str(sha256, f"{list_key}[{idx}].sha256"))

        loras.append(
            LoRAEntry(
                name=name,
                full_path=full_path,
                strength_model=strength_model,
                strength_clip=strength_clip,
                sha256=sha256,
                enabled=enabled,
            )
        )

    return LoRAListDocument(version=version, loras=loras)


def loads_lora_list_json(text: str, *, strict: bool = True) -> LoRAListDocument:
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise LoRAListParseError(f"Invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise LoRAListParseError("LoRA list JSON must be an object")
    return parse_lora_list_json(data, strict=strict)


def load_lora_list_json_file(path: str | Path, *, strict: bool = True) -> LoRAListDocument:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    return loads_lora_list_json(text, strict=strict)


def dumps_lora_list_json(doc: LoRAListDocument, *, indent: int = 2, ensure_ascii: bool = False) -> str:
    """
    Serialize back to the `loraListExample.json` structure.
    """
    payload: dict[str, Any] = {
        "version": int(doc.version),
        "LoRAList": [
            {
                **({"name": item.name} if item.name is not None else {}),
                "full_path": item.full_path,
                "MStrength": float(item.strength_model),
                "CStrength": float(item.strength_clip),
                **({"sha256": item.sha256} if item.sha256 is not None else {}),
                "toggleOn": bool(item.enabled),
            }
            for item in doc.loras
        ],
    }
    return json.dumps(payload, indent=indent, ensure_ascii=ensure_ascii)
