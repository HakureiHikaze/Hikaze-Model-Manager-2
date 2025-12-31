from dataclasses import dataclass

@dataclass(slots=True)
class Prompts:
  positive: str
  negative: str

@dataclass(slots=True)
class OldMetaJson :
  description: str
  community_links: str
  images: list[str]
  prompts: Prompts

@dataclass(slots=True)
class MetaJson :
  description: str
  community_links: str
  images_count: int
  prompts: Prompts

@dataclass(slots=True)
class ModelRecord:
  sha256: str
  path: str
  name: str
  type: str
  size_bytes: int
  created_at: int
  meta_json: MetaJson

@dataclass(slots=True)
class PendingModelRecord:
  id: int
  path: str
  sha256: str
  name: str
  type: str
  size_bytes: int
  created_at: int
  meta_json: OldMetaJson

@dataclass(frozen=True,slots=True)
class ModelSimpleRecord:
  sha256: str
  name: str
  images_count: int

@dataclass(frozen=True,slots=True)
class PendingModelSimpleRecord:
  id: int
  name: str
  image: str
