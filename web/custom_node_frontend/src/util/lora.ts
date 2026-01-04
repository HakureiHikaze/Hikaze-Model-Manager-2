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

  // Use unified keys, but support fallbacks during migration/parsing
  const name = coerceString(value.name) ?? ''

  const fullPath =
    coerceString(value.full_path) ??
    coerceString((value as any).fullPath) ??
    coerceString((value as any).path) ??
    ''

  const strengthModel =
    coerceNumber(value.strength_model) ??
    coerceNumber((value as any).MStrength) ??
    coerceNumber((value as any).strengthModel) ??
    1

  const strengthClip =
    coerceNumber(value.strength_clip) ??
    coerceNumber((value as any).CStrength) ??
    coerceNumber((value as any).strengthClip) ??
    1

  const enabled =
    coerceBool(value.enabled) ??
    coerceBool((value as any).toggleOn) ??
    true

  const sha256 = coerceString(value.sha256) ?? ''

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

/**
 * Stringify using ONLY unified keys.
 * Discard legacy keys like MStrength, toggleOn.
 */
export function stringifyLoRAListDocument(doc: LoRAListDocument): string {
  return JSON.stringify(
    {
      version: Number(doc.version) || 1,
      LoRAs: doc.LoRAs.map((item) => ({
        name: String(item.name ?? ''),
        full_path: String(item.full_path ?? ''),
        strength_model: Number(item.strength_model) || 0,
        strength_clip: Number(item.strength_clip) || 0,
        sha256: String(item.sha256 ?? ''),
        enabled: !!item.enabled
      }))
    },
    null,
    2
  )
}