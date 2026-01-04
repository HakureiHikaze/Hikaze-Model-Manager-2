from dataclasses import dataclass, field

@dataclass(slots=True)
class Tag:
  id: int
  name: str

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
  tags: list[Tag] = field(default_factory=list)

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
  tags: list[Tag] = field(default_factory=list)

@dataclass(frozen=True,slots=True)
class ModelSimpleRecord:
  sha256: str
  name: str
  images_count: int
  type: str = ""
  path: str = ""
  size_bytes: int = 0
  created_at: int = 0
  tags: list[Tag] = field(default_factory=list)


@dataclass(frozen=True,slots=True)
class PendingModelSimpleRecord:
  id: int
  name: str
  image: str
  tags: list[Tag] = field(default_factory=list)

