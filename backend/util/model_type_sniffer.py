from __future__ import annotations

from dataclasses import dataclass
import json
import logging
import os
from types import MappingProxyType
from typing import Mapping

from . import config

logger = logging.getLogger(__name__)


@dataclass(frozen=True, slots=True)
class ModelTypeIndex:
    """
    Read-only snapshot of ComfyUI model type keys and their search paths.
    """

    types: tuple[str, ...]
    paths_by_type: Mapping[str, tuple[str, ...]]
    model_types: tuple[str, ...]
    model_paths_by_type: Mapping[str, tuple[str, ...]]

    def __contains__(self, item: str) -> bool:
        return item in self.types

    def get_paths(self, type_name: str) -> tuple[str, ...]:
        return self.paths_by_type.get(type_name, ())


def _is_model_type(exts: set[str], supported_exts: set[str]) -> bool:
    if exts & supported_exts:
        return True
    for ext in exts:
        if ext and not ext.startswith("."):
            return True
    return False


def _cache_path() -> str:
    return os.path.join(config.DATA_DIR, "types_cache.json")


def _write_cache(types: tuple[str, ...], paths_by_type: Mapping[str, tuple[str, ...]], model_types: tuple[str, ...]) -> None:
    payload = {
        "version": 1,
        "types": list(types),
        "paths_by_type": {k: list(paths_by_type[k]) for k in types},
        "model_types": list(model_types),
    }
    try:
        with open(_cache_path(), "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=True)
    except OSError as exc:
        logger.warning("Failed to write types cache: %s", exc)


def _read_cache() -> dict | None:
    path = _cache_path()
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, dict):
            return None
        return data
    except (OSError, json.JSONDecodeError) as exc:
        logger.warning("Failed to read types cache: %s", exc)
        return None


def _build_index(
    types: list[str],
    paths_by_type: dict[str, tuple[str, ...]],
    model_types: list[str],
) -> ModelTypeIndex:
    return ModelTypeIndex(
        types=tuple(types),
        paths_by_type=MappingProxyType({k: paths_by_type[k] for k in types}),
        model_types=tuple(model_types),
        model_paths_by_type=MappingProxyType(
            {k: paths_by_type[k] for k in model_types if k in paths_by_type}
        ),
    )


def _load_index() -> ModelTypeIndex:
    try:
        import folder_paths
        raw = folder_paths.folder_names_and_paths
        supported_exts = set(getattr(folder_paths, "supported_pt_extensions", set()))

        types = sorted(raw.keys())
        paths_by_type: dict[str, tuple[str, ...]] = {}
        model_types: list[str] = []
        model_paths_by_type: dict[str, tuple[str, ...]] = {}

        for type_name in types:
            paths, exts = raw[type_name]
            path_tuple = tuple(paths)
            paths_by_type[type_name] = path_tuple

            if _is_model_type(set(exts), supported_exts):
                model_types.append(type_name)
                model_paths_by_type[type_name] = path_tuple

        types_tuple = tuple(types)
        model_types_tuple = tuple(sorted(model_types))
        _write_cache(types_tuple, paths_by_type, model_types_tuple)
        return _build_index(types, paths_by_type, list(model_types_tuple))
    except Exception as exc:
        logger.warning("Failed to load model types from ComfyUI: %s", exc)

    cache = _read_cache()
    if cache:
        cached_types = cache.get("types", [])
        cached_paths = cache.get("paths_by_type", {})
        cached_model_types = cache.get("model_types", cached_types)
        if isinstance(cached_types, list) and isinstance(cached_paths, dict):
            paths_by_type: dict[str, tuple[str, ...]] = {}
            for key in cached_types:
                raw_paths = cached_paths.get(key, [])
                if isinstance(raw_paths, list):
                    paths_by_type[key] = tuple(raw_paths)
            model_types = [t for t in cached_model_types if t in paths_by_type]
            return _build_index(list(cached_types), paths_by_type, model_types)

    return ModelTypeIndex(
        types=(),
        paths_by_type=MappingProxyType({}),
        model_types=(),
        model_paths_by_type=MappingProxyType({}),
    )


_INSTANCE = _load_index()


def get_model_type_index() -> ModelTypeIndex:
    """
    Return the singleton model type index.
    """

    return _INSTANCE


def get_model_types() -> tuple[str, ...]:
    """
    Convenience accessor for the tuple of model type keys (filtered).
    """
    if _INSTANCE.model_types:
        return _INSTANCE.model_types

    # Fallback: Query DB
    try:
        from backend.database.db import DatabaseManager
        db = DatabaseManager()
        rows = db.execute_query("SELECT DISTINCT type FROM models WHERE type IS NOT NULL AND type != ''")
        types = [r["type"] for r in rows]
        types.sort()
        return tuple(types)
    except Exception as e:
        logger.warning(f"Failed to fetch types from DB fallback: {e}")
        return ()


def get_model_paths(type_name: str) -> tuple[str, ...]:
    """
    Convenience accessor for model search paths by type name.
    """

    return _INSTANCE.get_paths(type_name)
