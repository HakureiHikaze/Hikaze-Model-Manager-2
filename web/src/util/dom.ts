/**
 * Return the DOM element of a VueNodes-rendered ComfyUI node by node id.
 *
 * In VueNodes mode, nodes are rendered as `.lg-node[data-node-id="..."]`.
 */
export function getVueNodeElement(nodeId: string | number): HTMLElement | null {
  const selector = `[data-node-id="${nodeId}"]`
  
  // 1. Try precise selector with class
  let candidates = document.querySelectorAll(`.lg-node${selector}`)
  
  // 2. Fallback to loose selector (if class changed)
  if (candidates.length === 0) {
    candidates = document.querySelectorAll(selector)
  }

  // 3. Find the first VISIBLE candidate.
  // This handles multi-tab scenarios where multiple nodes with same ID might exist,
  // but only one is currently rendered/visible.
  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i] as HTMLElement
    // offsetParent is null if element or any parent is display:none
    if (el.offsetParent !== null) {
      return el
    }
  }

  // 4. If none are visible (e.g. initial render before layout), return the first one
  // so we can at least try to attach. Frame retries will handle timing issues.
  return candidates.length > 0 ? (candidates[0] as HTMLElement) : null
}

/**
 * Return the widget container element inside a VueNodes node.
 *
 * We use this as a stable mounting target for body overlays (absolute/inset:0).
 */
export function getVueNodeWidgetBodyElement(
  nodeId: string | number
): HTMLElement | null {
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return null
  return nodeEl.querySelector('.lg-node-widgets') as HTMLElement | null
}

/**
 * Find a schema text input element by schema widget name (`aria-label`).
 *
 * ComfyUI's schema-based widgets use `aria-label="<widgetName>"` which lets us
 * locate the input without depending on internal component structure.
 */
export function findSchemaTextInput(
  nodeId: string | number,
  widgetName: string
): HTMLInputElement | null {
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return null
  return nodeEl.querySelector(
    `input[aria-label="${widgetName}"]`
  ) as HTMLInputElement | null
}
