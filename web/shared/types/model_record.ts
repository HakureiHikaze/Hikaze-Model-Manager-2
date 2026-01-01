import type { Prompts, Tag } from './common';

export interface MetaJson {
    description: string;
    community_links: string;
    images_count: number;
    prompts: Prompts;
}

export interface OldMetaJson {
    description: string;
    community_links: string;
    images: string[];
    prompts: Prompts;
}

/**
 * Strict DB Record with Relations.
 */
export interface ModelRecord {
    sha256: string;
    path: string;
    name: string;
    type: string;
    size_bytes: number;
    created_at: number;
    meta_json: MetaJson;
    tags: Tag[];
}

export interface PendingModelRecord {
    id: number;
    path: string;
    sha256: string;
    name: string;
    type: string;
    size_bytes: number;
    created_at: number;
    meta_json: OldMetaJson;
    tags: Tag[];
}

/**
 * Simplified record for Library/Grid View.
 * Matches backend ModelSimpleRecord.
 */
export interface ModelSimpleRecord {
    sha256: string;
    name: string;
    images_count: number;
    tags: Tag[];
}

export interface PendingModelSimpleRecord {
    id: number;
    name: string;
    image: string;
    tags: Tag[];
}

/**
 * Alias 'Model' to 'ModelSimpleRecord' for frontend usage.
 * This is the type returned by `GET /api/models`.
 */
export type Model = ModelSimpleRecord;

/**
 * Full Model Details.
 * Matches `GET /api/models/{sha256}`.
 */
export type ModelFull = ModelRecord;

/**
 * Payload for updating a model.
 */
export interface ModelUpdatePayload extends ModelRecord {}