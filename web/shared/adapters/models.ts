import type { 
    ModelRecord, 
    ModelSimpleRecord, 
    MetaJson, 
    PendingModelSimpleRecord 
} from '../types/model_record';
import type { Prompts } from '../types/common';
import { adaptTag } from './tags';

/**
 * Ensures a Prompts object has no null/undefined fields.
 */
export function adaptPrompts(raw: any): Prompts {
    return {
        positive: String(raw?.positive ?? ""),
        negative: String(raw?.negative ?? "")
    };
}

/**
 * Ensures a MetaJson object has no null/undefined fields.
 */
export function adaptMetaJson(raw: any): MetaJson {
    return {
        description: String(raw?.description ?? ""),
        community_links: String(raw?.community_links ?? ""),
        images_count: Number(raw?.images_count ?? 0),
        prompts: adaptPrompts(raw?.prompts)
    };
}

/**
 * Adapts raw API data to a strict ModelRecord.
 */
export function adaptModelRecord(raw: any): ModelRecord {
    return {
        sha256: String(raw?.sha256 ?? ""),
        path: String(raw?.path ?? ""),
        name: String(raw?.name ?? ""),
        type: String(raw?.type ?? ""),
        size_bytes: Number(raw?.size_bytes ?? 0),
        created_at: Number(raw?.created_at ?? 0),
        meta_json: adaptMetaJson(raw?.meta_json),
        tags: Array.isArray(raw?.tags) ? raw.tags.map(adaptTag) : []
    };
}

/**
 * Adapts raw API data to a strict ModelSimpleRecord (Model).
 */
export function adaptModelSimpleRecord(raw: any): ModelSimpleRecord {
    return {
        sha256: String(raw?.sha256 ?? ""),
        name: String(raw?.name ?? ""),
        images_count: Number(raw?.images_count ?? 0),
        type: String(raw?.type ?? ""),
        path: String(raw?.path ?? ""),
        size_bytes: Number(raw?.size_bytes ?? 0),
        created_at: Number(raw?.created_at ?? 0),
        tags: Array.isArray(raw?.tags) ? raw.tags.map(adaptTag) : []
    };
}

/**
 * Adapts raw API data to a strict PendingModelSimpleRecord.
 */
export function adaptPendingModelSimpleRecord(raw: any): PendingModelSimpleRecord {
    return {
        id: Number(raw?.id ?? 0),
        name: String(raw?.name ?? ""),
        image: String(raw?.image ?? ""),
        type: String(raw?.type ?? ""),
        tags: Array.isArray(raw?.tags) ? raw.tags.map(adaptTag) : []
    };
}