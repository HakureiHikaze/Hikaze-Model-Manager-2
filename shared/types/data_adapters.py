from dataclasses import asdict
from typing import Any, Dict
from .model_record import ModelRecord, ModelSimpleRecord, PendingModelRecord, PendingModelSimpleRecord, MetaJson, OldMetaJson, Prompts
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
            images_count
        )
        
    @staticmethod
    def full_pending_to_simple_pending(fullPending: PendingModelRecord) -> PendingModelSimpleRecord:
        name = fullPending.name if fullPending.name else _path2filename(fullPending.path)
        first_image = ""
        if fullPending.meta_json and fullPending.meta_json.images:
            first_image = fullPending.meta_json.images[0]
        return PendingModelSimpleRecord(
            fullPending.id,
            name,
            first_image
        )

    @staticmethod
    def dict_to_meta_json(data: Dict[str, Any]) -> MetaJson:
        prompts_data = data.get("prompts", {})
        prompts = Prompts(
            positive=prompts_data.get("positive", ""),
            negative=prompts_data.get("negative", "")
        )
        return MetaJson(
            description=data.get("description", ""),
            community_links=data.get("community_links", ""),
            images_count=data.get("images_count", 0),
            prompts=prompts
        )

    @staticmethod
    def dict_to_old_meta_json(data: Dict[str, Any]) -> OldMetaJson:
        prompts_data = data.get("prompts", {})
        prompts = Prompts(
            positive=prompts_data.get("positive", ""),
            negative=prompts_data.get("negative", "")
        )
        return OldMetaJson(
            description=data.get("description", ""),
            community_links=data.get("community_links", ""),
            images=data.get("images", []),
            prompts=prompts
        )