/**
 * Unified node position adapter for Hikaze overlays.
 *
 * Provides a consistent interface for obtaining node position/size information
 * regardless of whether ComfyUI is running in VueNodes mode or Legacy Canvas mode.
 *
 * In Legacy Canvas mode, we create absolute-positioned HTML overlays on top of
 * the canvas, synced with LiteGraph node positions.
 */

type UnknownNode = {
  id?: string | number
  pos?: [number, number]
  size?: [number, number]
  flags?: { collapsed?: boolean }
  inputs?: Array<any>
  outputs?: Array<any>
  widgets?: Array<any>
  widgets_start_y?: number
}

type UnknownApp = any

/**
 * Position and size information for a node overlay.
 */
export interface NodeOverlayGeometry {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Adapter for getting node position/size in a mode-agnostic way.
 */
export class NodePositionAdapter {
  private readonly nodeId: string | number
  private readonly node: UnknownNode
  private readonly app: UnknownApp

  constructor(nodeId: string | number, node: UnknownNode, app: UnknownApp) {
    this.nodeId = nodeId
    this.node = node
    this.app = app
  }

  /**
   * Get the current geometry for the overlay.
   * Returns null if the node cannot be found or measured.
   */
  getGeometry(): NodeOverlayGeometry | null {
    const nodePos = this.node?.pos
    const nodeSize = this.node?.size

    if (!nodePos || !nodeSize) {
      return null
    }

    const [x, y] = nodePos
    const [width, height] = nodeSize

    // If node is collapsed, adjust height
    const actualHeight = this.node?.flags?.collapsed
      ? Math.min(height, 60) // Collapsed nodes are shorter
      : height

    // Transform canvas coordinates to screen coordinates
    const screenGeometry = this.canvasToScreen(x, y, width, actualHeight)
    if (!screenGeometry) {
      return null
    }

    return screenGeometry
  }

  /**
   * Transform canvas coordinates to screen pixel coordinates.
   * Uses LiteGraph's DragAndScale (ds) state for precise positioning.
   */
  private canvasToScreen(
    canvasX: number,
    canvasY: number,
    width: number,
    height: number
  ): NodeOverlayGeometry | null {
    const canvas = this.app?.canvas
    if (!canvas || !canvas.canvas) {
      return null
    }

    // Use LiteGraph's ds (DragScale) state for accurate offset/scale
    const ds = canvas.ds
    const scale = ds?.scale ?? 1
    const offset = ds?.offset ?? [0, 0]

    // Get canvas element position on page
    const canvasRect = canvas.canvas.getBoundingClientRect()
    
    // Formula: screenPos = canvasRectPos + (nodeCanvasPos + dsOffset) * scale
    const screenX = canvasRect.left + (canvasX + offset[0]) * scale
    const screenY = canvasRect.top + (canvasY + offset[1]) * scale

    // Scale dimensions
    const scaledWidth = width * scale
    const scaledHeight = height * scale

    return {
      x: screenX,
      y: screenY,
      width: scaledWidth,
      height: scaledHeight
    }
  }

  /**
   * Get the geometry for just the widget area of the node (excluding IO slots).
   * In LiteGraph, the node body contains IO slots at the top and widgets below.
   * This method returns the geometry of only the widget area.
   */
  getWidgetAreaGeometry(): NodeOverlayGeometry | null {
    const fullGeometry = this.getGeometry()
    if (!fullGeometry) return null

    const widgetsStartY = this.getWidgetsStartY()
    const scale = this.getScale()
    const scaledOffset = widgetsStartY * scale

    // Ensure we don't produce negative height
    const adjustedHeight = Math.max(0, fullGeometry.height - scaledOffset)

    return {
      x: fullGeometry.x,
      y: fullGeometry.y + scaledOffset,
      width: fullGeometry.width,
      height: adjustedHeight
    }
  }

  /**
   * Get the geometry for a specific widget, with inset to avoid covering resize handles.
   * Uses the widget's `last_y` property (set by LiteGraph during drawing) for precise positioning.
   *
   * @param widgetName - Name of the widget to align to
   * @param inset - Graph-space inset (pixels at scale=1) to shrink overlay from node edges
   */
  getTargetWidgetGeometry(widgetName: string, inset: number = 6): NodeOverlayGeometry | null {
    const nodePos = this.node?.pos
    const nodeSize = this.node?.size
    if (!nodePos || !nodeSize) return null
    if (this.node?.flags?.collapsed) return null

    // Find the target widget's Y position
    const widget = Array.isArray(this.node.widgets)
      ? this.node.widgets.find((w: any) => w?.name === widgetName)
      : undefined
    const widgetY = (typeof widget?.last_y === 'number')
      ? widget.last_y
      : this.getWidgetsStartY()

    // Compute overlay rect in graph/canvas space with inset
    const canvasX = nodePos[0] + inset
    const canvasY = nodePos[1] + widgetY
    const width = Math.max(0, nodeSize[0] - 2 * inset)
    const height = Math.max(0, nodeSize[1] - widgetY - inset)

    if (width <= 0 || height <= 0) return null

    return this.canvasToScreen(canvasX, canvasY, width, height)
  }

  /**
   * Compute the Y offset (in canvas/graph space) where widgets start within the node body.
   * Prefers the LiteGraph-computed `widgets_start_y` property if available,
   * otherwise estimates from the number of IO slots.
   */
  private getWidgetsStartY(): number {
    // Prefer LiteGraph's pre-computed value
    if (typeof this.node?.widgets_start_y === 'number' && this.node.widgets_start_y > 0) {
      return this.node.widgets_start_y
    }

    // Fallback: estimate from IO slot counts
    const numInputs = Array.isArray(this.node?.inputs) ? this.node.inputs.length : 0
    const numOutputs = Array.isArray(this.node?.outputs) ? this.node.outputs.length : 0
    const maxSlots = Math.max(numInputs, numOutputs)

    if (maxSlots === 0) return 0

    // Read slot height from LiteGraph global if available, otherwise use default
    const slotHeight = (globalThis as any)?.LiteGraph?.NODE_SLOT_HEIGHT ?? 20
    return maxSlots * slotHeight
  }

  /**
   * Get the current scale of the canvas.
   */
  getScale(): number {
    const ds = this.app?.canvas?.ds
    return ds?.scale ?? 1
  }

  /**
   * Check if the node is currently visible on screen (not off-screen).
   */
  isVisible(): boolean {
    const geometry = this.getGeometry()
    if (!geometry) {
      return false
    }

    // Check if any part of the node is within the viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    const nodeRight = geometry.x + geometry.width
    const nodeBottom = geometry.y + geometry.height

    return (
      geometry.x < scrollX + viewportWidth &&
      nodeRight > scrollX &&
      geometry.y < scrollY + viewportHeight &&
      nodeBottom > scrollY
    )
  }
}

/**
 * Get the container element where overlays should be appended.
 * In Legacy mode, this is the canvas parent element.
 * In VueNodes mode, this is the node's widget container.
 */
export function getOverlayContainer(
  nodeId: string | number,
  mode: 'vue' | 'legacy',
  app: UnknownApp
): HTMLElement | null {
  if (mode === 'vue') {
    // VueNodes mode: use existing logic
    const selector = `[data-node-id="${nodeId}"]`
    const candidates = document.querySelectorAll(`.lg-node${selector}`)
    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i] as HTMLElement
      if (el.offsetParent !== null) {
        return el.querySelector('.lg-node-widgets') as HTMLElement | null
      }
    }
    return null
  }

  // Legacy mode: use canvas parent container
  const canvas = app?.canvas?.canvas
  if (!canvas) {
    return null
  }

  // Find or create the overlay container
  let container = canvas.parentElement?.querySelector(
    "[data-hikaze-overlay-container='1']"
  ) as HTMLElement | null

  if (!container) {
    // Create new container
    container = document.createElement('div')
    container.setAttribute('data-hikaze-overlay-container', '1')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '100'
    canvas.parentElement?.insertBefore(container, canvas.nextSibling)
  }

  return container
}
