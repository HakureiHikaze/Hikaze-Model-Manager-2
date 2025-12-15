/**
 * Return the DOM element of a VueNodes-rendered ComfyUI node by node id.
 *
 * In VueNodes mode, nodes are rendered as `.lg-node[data-node-id="..."]`.
 */
export function getVueNodeElement(nodeId: string | number): HTMLElement | null {
  return document.querySelector(
    `.lg-node[data-node-id="${nodeId}"]`
  ) as HTMLElement | null
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
