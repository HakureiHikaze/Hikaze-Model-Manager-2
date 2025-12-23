import type { LoRAEntry, LoRAListDocument } from '../injection/types'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function coerceString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return null
}

function coerceBool(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  return null
}

function normalizeEntry(value: unknown): LoRAEntry | null {
  if (!isRecord(value)) return null

  const name = coerceString(value.name) ?? undefined

  const fullPath =
    coerceString(value.full_path) ??
    coerceString((value as any).fullPath) ??
    coerceString((value as any).path) ??
    coerceString(value.name) ??
    ''

  const strengthModel =
    coerceNumber((value as any).MStrength) ??
    coerceNumber((value as any).strength_model) ??
    coerceNumber((value as any).strengthModel) ??
    1

  const strengthClip =
    coerceNumber((value as any).CStrength) ??
    coerceNumber((value as any).strength_clip) ??
    coerceNumber((value as any).strengthClip) ??
    1

  const enabled =
    coerceBool((value as any).toggleOn) ??
    coerceBool((value as any).enabled) ??
    true

  const sha256 = coerceString((value as any).sha256) ?? undefined

  return {
    name,
    full_path: fullPath,
    strength_model: strengthModel,
    strength_clip: strengthClip,
    sha256,
    enabled: enabled
  }
}

export function createEmptyLoRAListDocument(): LoRAListDocument {
  return { version: 1, LoRAs: [] }
}

/**
 * Parse various legacy/current JSON shapes into the canonical LoRAListDocument.
 *
 * Accepted shapes:
 * - `{ version, LoRAs: [...] }` (canonical)
 * - `{ version, LoRAList: [...] }` (example file / legacy key)
 * - `{ loras: [...] }` (older experimental format)
 * - `[...]` (array of entry objects)
 */
export function parseLoRAListJson(text: string): LoRAListDocument {
  const raw = text.trim()
  if (!raw) return createEmptyLoRAListDocument()

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch (e: any) {
    throw new Error(String(e?.message ?? e ?? 'Invalid JSON'))
  }

  let version = 1
  let listValue: unknown = null

  if (Array.isArray(value)) {
    listValue = value
  } else if (isRecord(value)) {
    version = coerceNumber(value.version) ?? 1
    listValue =
      (value as any).LoRAs ??
      (value as any).LoRAList ??
      (value as any).loras ??
      null
  }

  if (!Array.isArray(listValue)) {
    return { version, LoRAs: [] }
  }

  const loras: LoRAEntry[] = []
  for (const item of listValue) {
    const entry = normalizeEntry(item)
    if (entry) loras.push(entry)
  }

  return { version, LoRAs: loras }
}

export function stringifyLoRAListDocument(doc: LoRAListDocument): string {
  return JSON.stringify(
    {
      version: Number(doc.version) || 1,
      LoRAs: doc.LoRAs.map((item) => ({
        ...(item.name ? { name: item.name } : {}),
        full_path: String(item.full_path ?? ''),
        MStrength: Number(item.strength_model) || 0,
        CStrength: Number(item.strength_clip) || 0,
        ...(item.sha256 ? { sha256: item.sha256 } : {}),
        toggleOn: !!item.enabled
      }))
    },
    null,
    2
  )
}

