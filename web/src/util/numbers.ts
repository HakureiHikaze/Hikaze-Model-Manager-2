/**
 * Coerce a value into a finite number; otherwise return the fallback.
 *
 * Useful when parsing user-provided JSON / DOM values.
 */
export function coerceNumber(value: unknown, fallback: number) {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}
