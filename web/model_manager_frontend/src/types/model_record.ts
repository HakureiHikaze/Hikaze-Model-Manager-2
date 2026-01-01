export interface Prompts{
    positive: string;
    negative: string;
}

export interface MetaJson{
    description: string;
    community_links: string;
    images_count: number;
    prompts: Prompts;
}

export interface OldMetaJson{
    description: string;
    community_links: string;
    images: string[];
    prompts: Prompts;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ModelRecord{
    sha256:string;
    path: string;
    name: string;
    type: string;
    size_bytes: number;
    created_at: number;
    meta_json: MetaJson;
    tags: Tag[];
}

export interface PendingModelRecord{
    id: number;
    path: string;
    sha256:string;
    name: string;
    type: string;
    size_bytes: number;
    created_at: number;
    meta_json: OldMetaJson;
    tags: Tag[];
}



export interface Model {
  sha256: string;
  name: string;
  type: string;
  path: string;
  size_bytes: number;
  created_at: number;
  tags: Tag[];
}

export interface ModelSimpleRecordWithTags{
    sha256: string;
    name: string;
    images_count: number;
    tags: Tag[];
}

export interface PendingModelSimpleRecordWithTags{
    id: number;
    name: string;
    images: string;
    tags: Tag[];
}