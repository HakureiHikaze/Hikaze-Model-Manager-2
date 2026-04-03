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
   */
  private canvasToScreen(
    canvasX: number,
    canvasY: number,
    width: number,
    height: number
  ): NodeOverlayGeometry | null {
    const canvas = this.app?.canvas?.canvas
    if (!canvas) {
      return null
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return null
    }

    // Get the current transformation matrix
    const transform = ctx.getTransform()

    // Apply transformation to get screen coordinates
    const screenX = canvasX * transform.a + canvasY * transform.c + transform.e
    const screenY = canvasX * transform.b + canvasY * transform.d + transform.f

    // Scale dimensions
    const scaledWidth = width * transform.a
    const scaledHeight = height * transform.d

    // Get canvas element position on page
    const canvasRect = canvas.getBoundingClientRect()
    const canvasOffsetX = canvasRect.left + window.scrollX
    const canvasOffsetY = canvasRect.top + window.scrollY

    return {
      x: canvasOffsetX + screenX,
      y: canvasOffsetY + screenY,
      width: scaledWidth,
      height: scaledHeight
    }
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
