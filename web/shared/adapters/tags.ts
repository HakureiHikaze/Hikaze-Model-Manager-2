import type { Tag } from '../types/common';

/**
 * Ensures a Tag object has no null/undefined fields.
 */
export function adaptTag(raw: any): Tag {
    return {
        id: Number(raw?.id ?? 0),
        name: String(raw?.name ?? "")
    };
}
