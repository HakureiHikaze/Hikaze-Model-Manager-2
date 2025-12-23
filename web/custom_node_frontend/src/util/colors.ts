export type RGB = { r: number; g: number; b: number }

/**
 * Clamp a number into [0, 1].
 *
 * Used for alpha blending when constructing rgba() strings.
 */
export function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(1, n))
}

/**
 * Parse `rgb(r, g, b)` or `rgba(r, g, b, a)` (alpha ignored) into RGB.
 */
export function parseRgb(color: string): RGB | null {
  const m = color
    .trim()
    .match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i)
  if (!m) return null
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
}

/**
 * Parse hex color forms: `#rgb` or `#rrggbb`.
 */
export function parseHex(color: string): RGB | null {
  const hex = color.trim()
  if (!hex.startsWith('#')) return null
  const v = hex.slice(1)
  if (v.length === 3) {
    const r = parseInt(v[0] + v[0], 16)
    const g = parseInt(v[1] + v[1], 16)
    const b = parseInt(v[2] + v[2], 16)
    return { r, g, b }
  }
  if (v.length === 6) {
    const r = parseInt(v.slice(0, 2), 16)
    const g = parseInt(v.slice(2, 4), 16)
    const b = parseInt(v.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

/**
 * Convert RGB + alpha into an rgba(...) CSS string.
 */
export function toRgba(rgb: RGB, alpha: number) {
  const a = clamp01(alpha)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

/**
 * Best-effort check for fully transparent colors.
 */
export function isTransparent(color: string) {
  const v = color.trim().toLowerCase()
  return (
    v === 'transparent' ||
    v === 'rgba(0, 0, 0, 0)' ||
    v === 'rgba(0,0,0,0)'
  )
}

/**
 * Pick an accent color for a ComfyUI node element.
 *
 * Strategy:
 * 1) Prefer CSS custom properties used by ComfyUI/LiteGraph.
 * 2) Fall back to node header background or border colors.
 *
 * Returns a CSS color string (rgb/rgba/hex) or null if nothing usable found.
 */
export function pickNodeAccentColor(nodeEl: HTMLElement): string | null {
  try {
    const style = getComputedStyle(nodeEl)
    const vars = [
      '--node-color',
      '--comfy-node-color',
      '--lg-node-color',
      '--node-accent',
      '--node-accent-color'
    ]
    for (const key of vars) {
      const v = style.getPropertyValue(key).trim()
      if (v) return v
    }

    const header =
      (nodeEl.querySelector('.lg-node-header') as HTMLElement | null) ??
      (nodeEl.querySelector('.lg-node-titlebar') as HTMLElement | null) ??
      (nodeEl.querySelector('.lg-node-title') as HTMLElement | null)
    if (header) {
      const bg = getComputedStyle(header).backgroundColor
      if (bg && !isTransparent(bg)) return bg
    }

    const border = style.borderTopColor || style.borderColor
    if (border && !isTransparent(border)) return border
  } catch {
    // ignore
  }
  return null
}
