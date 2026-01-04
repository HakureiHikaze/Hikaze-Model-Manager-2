import type { LoRAEntry, LoRAListDocument } from '../types/lora_list';

/**
 * Ensures a LoRAEntry has no null/undefined fields.
 */
export function adaptLoRAEntry(raw: any): LoRAEntry {
    return {
        full_path: String(raw?.full_path ?? ""),
        strength_model: Number(raw?.strength_model ?? 1.0),
        strength_clip: Number(raw?.strength_clip ?? 1.0),
        enabled: Boolean(raw?.enabled ?? true),
        name: String(raw?.name ?? ""),
        sha256: String(raw?.sha256 ?? "")
    };
}

/**
 * Ensures a LoRAListDocument has no null/undefined fields.
 */
export function adaptLoRAListDocument(raw: any): LoRAListDocument {
    return {
        version: Number(raw?.version ?? 1),
        LoRAs: Array.isArray(raw?.LoRAs) ? raw.LoRAs.map(adaptLoRAEntry) : []
    };
}
