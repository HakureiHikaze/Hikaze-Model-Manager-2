from dataclasses import asdict
from typing import Any, Dict, List
from .model_record import ModelRecord, ModelSimpleRecord, PendingModelRecord, PendingModelSimpleRecord, MetaJson, OldMetaJson, Prompts, Tag
from ..util.tools import _path2filename

class DataAdapters:
    @staticmethod
    def to_dict(obj: Any) -> Dict[str, Any]:
        """Convert a dataclass instance to a dictionary, handling nested dataclasses."""
        if hasattr(obj, "__dataclass_fields__"):
            return asdict(obj)
        return obj

    @staticmethod
    def full_model_to_simple_model(fullModel: ModelRecord) -> ModelSimpleRecord:
        name = fullModel.name if fullModel.name else _path2filename(fullModel.path)
        images_count = fullModel.meta_json.images_count if fullModel.meta_json else 0
        return ModelSimpleRecord(
            fullModel.sha256,
            name,
            images_count,
            fullModel.type,
            fullModel.path,
            fullModel.size_bytes,
            fullModel.created_at,
            fullModel.tags
        )
        
    @staticmethod
    def full_pending_to_simple_pending(fullPending: PendingModelRecord) -> PendingModelSimpleRecord:
        name = fullPending.name if fullPending.name else _path2filename(fullPending.path)
        first_image = ""
        if fullPending.meta_json and fullPending.meta_json.images and len(fullPending.meta_json.images) > 0:
            first_image = fullPending.meta_json.images[0]
        return PendingModelSimpleRecord(
            fullPending.id,
            name,
            first_image,
            fullPending.type,
            fullPending.tags
        )

    @staticmethod
    def dict_to_prompts(data: Dict[str, Any] | None) -> Prompts:

        """Construct Prompts from dict, ensuring no None values."""
        if data is None:
            data = {}
        return Prompts(
            positive=str(data.get("positive") or ""),
            negative=str(data.get("negative") or "")
        )

    @staticmethod
    def dict_to_meta_json(data: Dict[str, Any] | None) -> MetaJson:
        """Construct MetaJson from dict, ensuring no None values."""
        if data is None:
            data = {}
        return MetaJson(
            description=str(data.get("description") or ""),
            community_links=str(data.get("community_links") or ""),
            images_count=int(data.get("images_count") or 0),
            prompts=DataAdapters.dict_to_prompts(data.get("prompts"))
        )

    @staticmethod
    def dict_to_old_meta_json(data: Dict[str, Any] | None) -> OldMetaJson:
        """Construct OldMetaJson from dict, ensuring no None values."""
        if data is None:
            data = {}
        images = data.get("images")
        if images is None:
            images = []
        return OldMetaJson(
            description=str(data.get("description") or ""),
            community_links=str(data.get("community_links") or ""),
            images=images,
            prompts=DataAdapters.dict_to_prompts(data.get("prompts"))
        )

    @staticmethod
    def dict_to_model_record(data: Dict[str, Any]) -> ModelRecord:
        """Construct ModelRecord from dict, ensuring no None values."""
        return ModelRecord(
            sha256=str(data.get("sha256") or ""),
            path=str(data.get("path") or ""),
            name=str(data.get("name") or ""),
            type=str(data.get("type") or ""),
            size_bytes=int(data.get("size_bytes") or 0),
            created_at=int(data.get("created_at") or 0),
            meta_json=DataAdapters.dict_to_meta_json(data.get("meta_json"))
        )

    @staticmethod
    def dict_to_pending_model_record(data: Dict[str, Any]) -> PendingModelRecord:
        """Construct PendingModelRecord from dict, ensuring no None values."""
        return PendingModelRecord(
            id=int(data.get("id") or 0),
            path=str(data.get("path") or ""),
            sha256=str(data.get("sha256") or ""),
            name=str(data.get("name") or ""),
            type=str(data.get("type") or ""),
            size_bytes=int(data.get("size_bytes") or 0),
            created_at=int(data.get("created_at") or 0),
            meta_json=DataAdapters.dict_to_old_meta_json(data.get("meta_json"))
        )
