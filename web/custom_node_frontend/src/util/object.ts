const HAS_OWN: (obj: any, key: PropertyKey) => boolean =
  Object.hasOwn ??
  ((obj, key) => Object.prototype.hasOwnProperty.call(obj, key))

/**
 * Safe `hasOwnProperty` that also works on objects without a normal prototype.
 */
export function hasOwn(obj: any, key: PropertyKey): boolean {
  if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) return false
  return HAS_OWN(obj, key)
}

/**
 * Define a non-enumerable flag/marker on an object.
 *
 * We use this to avoid re-hooking ComfyUI node instances multiple times.
 */
export function defineHiddenFlag(obj: any, key: string, value: any = true) {
  try {
    Object.defineProperty(obj, key, {
      value,
      enumerable: false,
      configurable: true
    })
    return
  } catch {
    // ignore
  }

  try {
    obj[key] = value
  } catch {
    // ignore
  }
}
