/**
 * Base controller for Hikaze nodes (front-end injection layer).
 *
 * This controller enforces a standardized architecture:
 * - A single `HikazeNodeFrame` is mounted to the node.
 * - State is synced via a standard `hikaze_payload` widget.
 * - Subclasses provide the Vue component and optional props.
 *
 * Supports both VueNodes mode and Legacy Canvas mode:
 * - VueNodes: Teleports into node's DOM container
 * - Legacy: Creates absolute-positioned overlay on canvas
 */
import { createApp, h, ref, type App as VueApp, type Ref } from 'vue'

import HikazeNodeFrame from '../../components/HikazeNodeFrame.vue'
import { getVueNodeWidgetBodyElement } from '../../util/dom'
import {
  NodePositionAdapter,
  getOverlayContainer,
  type NodeOverlayGeometry
} from '../../util/nodePositionAdapter'
import type { InjectionContext, InjectionMode } from '../types'
import { openManager } from '../modalService'

const PAYLOAD_WIDGET = 'hikaze_payload'

type UnknownNode = {
  id?: string | number
  type?: string
  title?: string
  pos?: [number, number]
  size?: [number, number]
  widgets?: Array<any>
  onResize?: () => void
  graph?: any
  onWidgetChanged?: (name: string, value: any, oldValue: any, widget: any) => void
}

export type HikazeNodeControllerConstructor = new (
  node: UnknownNode
) => BaseHikazeNodeController

export class BaseHikazeNodeController {
  static readonly registry = new Map<string, HikazeNodeControllerConstructor>()

  static register(nodeType: string, ctor: HikazeNodeControllerConstructor) {
    this.registry.set(nodeType, ctor)
  }

  static resolve(nodeType: string): HikazeNodeControllerConstructor | undefined {
    return this.registry.get(nodeType)
  }

  readonly node: UnknownNode

  /** Reactive copy of the `hikaze_payload` widget value. */
  protected readonly payloadRef = ref<string>('{}')

  private injectedMode: InjectionMode | null = null
  private cleanupFns: Array<() => void> = []

  private vueApp: VueApp | null = null
  private vueHost: HTMLDivElement | null = null
  private vueMountRetryTimer: number | null = null

  // Canvas mode overlay management
  private canvasOverlayEl: HTMLDivElement | null = null
  private positionAdapter: NodePositionAdapter | null = null
  private positionSyncTimer: number | null = null
  private resizeObserver: ResizeObserver | null = null
  private app: any = null

  private onWidgetChangedOriginal: any = null
  private onWidgetChangedWrapper: any = null
  private hydrationSyncTimers: number[] = []

  constructor(node: UnknownNode) {
    this.node = node
  }

  /**
   * Provide the Vue component to render inside the frame.
   * Subclasses MUST implement this.
   */
  protected getComponent(): any {
    return null
  }

  /**
   * Provide additional props for the component.
   * Default provides nothing; `nodeId`, `payload`, `commit` are passed automatically.
   */
  protected getComponentProps(): Record<string, any> {
    return {}
  }

  /** Override title if needed. Default is node.title. */
  protected getTitle(): string {
    return this.node?.title ?? 'Hikaze Node'
  }

  inject(ctx: InjectionContext) {
    // Guard against uninitialized nodes (e.g. drag previews)
    if (this.node.id == null || this.node.id === -1) {
      setTimeout(() => this.inject(ctx), 200)
      return
    }

    if (this.injectedMode && this.injectedMode !== ctx.mode) {
      this.dispose()
    }

    this.ensureWidgetChangeHook()
    this.syncFromWidget()
    this.scheduleHydrationSync(ctx)

    // Mount frame in both VueNodes and Legacy modes
    this.ensureFrameMounted(ctx)

    this.injectedMode = ctx.mode
  }

  reinject(ctx: InjectionContext) {
    this.dispose()
    this.inject(ctx)
  }

  dispose() {
    this.clearHydrationSync()
    this.unhookWidgetChange()
    this.stopPositionSync()

    if (this.vueMountRetryTimer != null) {
      window.clearTimeout(this.vueMountRetryTimer)
      this.vueMountRetryTimer = null
    }

    if (this.vueApp) {
      try {
        this.vueApp.unmount()
      } catch { /* ignore */ }
      this.vueApp = null
    }

    if (this.vueHost) {
      try {
        this.vueHost.remove()
      } catch { /* ignore */ }
      this.vueHost = null
    }

    // Clean up canvas overlay
    if (this.canvasOverlayEl) {
      try {
        this.canvasOverlayEl.remove()
      } catch { /* ignore */ }
      this.canvasOverlayEl = null
    }

    // Clean up position adapter
    this.positionAdapter = null

    if (this.resizeObserver) {
      try {
        this.resizeObserver.disconnect()
      } catch { /* ignore */ }
      this.resizeObserver = null
    }

    this.cleanupFns.forEach((fn) => {
        try { fn() } catch { /* ignore */ }
    })
    this.cleanupFns = []
    this.injectedMode = null
  }

  protected findWidget(widgetName: string) {
    const widgets = this.node?.widgets
    if (!Array.isArray(widgets)) return null
    return widgets.find((w) => w?.name === widgetName) ?? null
  }

  /**
   * Hook a legacy widget's mouse interaction to trigger a custom callback.
   * Returns true to prevent default behavior (e.g. preventing text edit mode).
   */
  protected hookLegacyWidgetClick(
    widgetName: string,
    onPick: (current: string) => string | null
  ) {
    const widget = this.findWidget(widgetName)
    if (!widget) return

    // Save original handler
    const originalMouse = widget.mouse

    // Override handler
    widget.mouse = (event: any, pos: any, node: any) => {
      if (event.type === 'pointerdown' || event.type === 'mousedown') {
        const current = String(widget.value ?? '')
        const next = onPick(current)
        if (next !== null && next !== current) {
          this.commitPayload(next)
        }
        return true // Prevent default behavior (e.g. entering text edit)
      }
      return originalMouse ? originalMouse.call(widget, event, pos, node) : undefined
    }

    this.cleanupFns.push(() => {
      widget.mouse = originalMouse
    })
  }

  protected setWidgetValue(widget: any, next: any) {
    const oldValue = widget?.value
    if (next === oldValue) return

    widget.value = next
    try {
      widget.callback?.(widget.value)
    } catch { /* ignore */ }
    try {
      this.node?.onWidgetChanged?.(widget.name ?? '', widget.value, oldValue, widget)
    } catch { /* ignore */ }
    try {
        // Trigger graph save
        if(this.node.graph) this.node.graph.setDirtyCanvas(true, true)
    } catch { /* ignore */ }
  }

  /**
   * Commit a new JSON string to the payload widget.
   */
  protected commitPayload(next: string) {
    const widget = this.findWidget(PAYLOAD_WIDGET)
    if (!widget) return
    
    // Basic validation to ensure it's string
    const val = String(next ?? '{}')
    this.setWidgetValue(widget, val)
    this.payloadRef.value = val
  }

  // --- Widget Sync Logic ---

  private ensureWidgetChangeHook() {
    const node: any = this.node
    if (!node || typeof node !== 'object') return
    if (this.onWidgetChangedWrapper) return

    this.onWidgetChangedOriginal = node.onWidgetChanged
    this.onWidgetChangedWrapper = (
      name: string,
      value: any,
      oldValue: any,
      widget: any
    ) => {
      if (name === PAYLOAD_WIDGET) {
        this.payloadRef.value = String(value ?? '{}')
      }

      const original = this.onWidgetChangedOriginal
      if (typeof original === 'function') {
        try {
          return original.call(node, name, value, oldValue, widget)
        } catch { /* ignore */ }
      }
    }
    node.onWidgetChanged = this.onWidgetChangedWrapper
  }

  private unhookWidgetChange() {
    const node: any = this.node
    if (!node || typeof node !== 'object') return
    if (node.onWidgetChanged === this.onWidgetChangedWrapper) {
      node.onWidgetChanged = this.onWidgetChangedOriginal
    }
    this.onWidgetChangedOriginal = null
    this.onWidgetChangedWrapper = null
  }

  private syncFromWidget() {
    const widget = this.findWidget(PAYLOAD_WIDGET)
    if (widget) {
        this.payloadRef.value = String(widget.value ?? '{}')
    }
  }

  private scheduleHydrationSync(ctx: InjectionContext) {
    this.clearHydrationSync()
    const delays = [0, 50, 150, 400, 800]
    for (const delay of delays) {
      const timer = window.setTimeout(() => this.syncFromWidget(), delay)
      this.hydrationSyncTimers.push(timer)
    }
  }

  private clearHydrationSync() {
    this.hydrationSyncTimers.forEach((t) => clearTimeout(t))
    this.hydrationSyncTimers = []
  }

  // --- Frame Mounting Logic ---

  /**
   * Mount the Vue component overlay for the node.
   * Supports both VueNodes mode (Teleport into DOM) and Legacy Canvas mode (absolute overlay).
   * 
   * Key principle: Vue App is mounted ONCE to the correct target container.
   * No unmount -> remount cycle, which would violate Vue 3 lifecycle rules.
   */
  private ensureFrameMounted(ctx: InjectionContext, attemptsRemaining = 50) {
    const nodeId = this.node?.id
    if (nodeId == null) {
      if (attemptsRemaining > 0) {
          this.vueMountRetryTimer = window.setTimeout(
            () => this.ensureFrameMounted(ctx, attemptsRemaining - 1), 50
          )
      }
      return
    }

    // Store app reference for position adapter
    this.app = ctx.app

    // Determine target container BEFORE creating Vue App
    let targetContainer: HTMLDivElement | null = null

    if (ctx.mode === 'legacy') {
      // Legacy mode: Get overlay container and create/reuse overlay div
      const container = getOverlayContainer(nodeId, 'legacy', this.app)
      if (!container) {
        console.warn('[Hikaze] Failed to get overlay container for node', nodeId)
        return
      }

      // Create or reuse the overlay div
      let overlay = container.querySelector(
        `[data-hikaze-canvas-overlay][data-node-id="${nodeId}"]`
      ) as HTMLDivElement | null

      if (!overlay) {
        overlay = document.createElement('div')
        overlay.setAttribute('data-hikaze-canvas-overlay', '1')
        overlay.setAttribute('data-node-id', String(nodeId))
        overlay.style.position = 'fixed'
        overlay.style.pointerEvents = 'auto'
        overlay.style.zIndex = '1000'
        overlay.style.overflow = 'hidden'
        container.appendChild(overlay)
      }

      this.canvasOverlayEl = overlay
      targetContainer = overlay

      // Start position synchronization for legacy mode
      this.startPositionSync()
    } else {
      // Vue mode: Create/reuse hidden host in body
      let host = document.querySelector(
        `[data-hikaze-node-overlay-host][data-node-id="${nodeId}"]`
      ) as HTMLDivElement | null

      if (!host) {
        host = document.createElement('div')
        host.setAttribute('data-hikaze-node-overlay-host', '1')
        host.setAttribute('data-node-id', String(nodeId))
        host.style.display = 'none'
        document.body.appendChild(host)
      }

      this.vueHost = host
      targetContainer = host

      // No position sync needed in Vue mode
      this.stopPositionSync()
    }

    // Create Vue App ONCE and mount to the determined target
    if (!this.vueApp) {
      const app = createApp({
        render: () =>
          h(this.getComponent(), {
            nodeId: nodeId,
            title: this.getTitle(),
            ...this.getComponentProps(),
            payload: this.payloadRef,
            commit: (v: string) => this.commitPayload(v)
          })
      })

      app.provide('openManager', openManager)
      app.mount(targetContainer)
      this.vueApp = app

      console.info(`[Hikaze] Mounted overlay for node ${nodeId} in ${ctx.mode} mode`)
    }
  }

  /**
   * Start synchronizing overlay position with canvas node position.
   */
  private startPositionSync() {
    this.stopPositionSync()

    // Initial position update
    this.syncOverlayPosition()

    // Track last synced state for change detection
    let lastScale = 0
    let lastOffsetX = 0
    let lastOffsetY = 0
    let lastNodePos: [number, number] | null = null
    let lastNodeSize: [number, number] | null = null

    // Sync on animation frame for smooth tracking
    const syncLoop = () => {
      if (!this.canvasOverlayEl || !this.app?.canvas?.ds) {
        this.positionSyncTimer = window.requestAnimationFrame(syncLoop)
        return
      }

      const ds = this.app.canvas.ds
      const currentScale = ds.scale ?? 1
      const currentOffset = ds.offset ?? [0, 0]
      const currentNodePos = this.node.pos as [number, number] | undefined
      const currentNodeSize = this.node.size as [number, number] | undefined

      // Check if anything has changed
      const scaleChanged = currentScale !== lastScale
      const offsetChanged = currentOffset[0] !== lastOffsetX || currentOffset[1] !== lastOffsetY
      const nodeMoved = !lastNodePos || 
                        currentNodePos?.[0] !== lastNodePos[0] || 
                        currentNodePos?.[1] !== lastNodePos[1]
      const nodeResized = !lastNodeSize || 
                          currentNodeSize?.[0] !== lastNodeSize[0] || 
                          currentNodeSize?.[1] !== lastNodeSize[1]

      if (scaleChanged || offsetChanged || nodeMoved || nodeResized) {
        // Update tracked state
        lastScale = currentScale
        lastOffsetX = currentOffset[0]
        lastOffsetY = currentOffset[1]
        lastNodePos = currentNodePos ? [...currentNodePos] : null
        lastNodeSize = currentNodeSize ? [...currentNodeSize] : null

        // Sync overlay position
        this.syncOverlayPosition()
      }

      this.positionSyncTimer = window.requestAnimationFrame(syncLoop)
    }
    this.positionSyncTimer = window.requestAnimationFrame(syncLoop)

    // Force sync on specific events with a small delay
    const forceSync = () => {
      setTimeout(() => {
        // Reset tracked state to force a full resync
        lastScale = 0
        lastOffsetX = 0
        lastOffsetY = 0
        lastNodePos = null
        lastNodeSize = null
        this.syncOverlayPosition()
      }, 16) // One frame delay
    }

    window.addEventListener('resize', forceSync)
    window.addEventListener('scroll', forceSync, true)
    
    const canvasEl = this.app?.canvas?.canvas
    if (canvasEl) {
      // Sync after zoom/drag interactions
      canvasEl.addEventListener('wheel', forceSync, { passive: true })
      canvasEl.addEventListener('pointerup', forceSync, { passive: true })
      // Also sync on double click (often triggers zoom)
      canvasEl.addEventListener('dblclick', forceSync, { passive: true })
    }
    
    this.cleanupFns.push(() => {
      window.removeEventListener('resize', forceSync)
      window.removeEventListener('scroll', forceSync, true)
      if (canvasEl) {
        canvasEl.removeEventListener('wheel', forceSync)
        canvasEl.removeEventListener('pointerup', forceSync)
        canvasEl.removeEventListener('dblclick', forceSync)
      }
    })
  }

  /**
   * Stop position synchronization.
   */
  private stopPositionSync() {
    if (this.positionSyncTimer != null) {
      window.cancelAnimationFrame(this.positionSyncTimer)
      this.positionSyncTimer = null
    }
  }

  /**
   * Update overlay position based on current canvas node position.
   */
  private syncOverlayPosition() {
    if (!this.canvasOverlayEl || !this.app) return

    // Create position adapter
    this.positionAdapter = new NodePositionAdapter(
      this.node.id!,
      this.node,
      this.app
    )

    const geometry = this.positionAdapter.getTargetWidgetGeometry(PAYLOAD_WIDGET)
    if (!geometry) {
      // Hide overlay if geometry cannot be determined
      this.canvasOverlayEl.style.display = 'none'
      return
    }

    // Get canvas scale to apply CSS transform so content scales with zoom
    const scale = this.positionAdapter.getScale()

    // Show and position overlay
    // Use transform: scale() so internal HTML content (text, controls) scales with canvas zoom.
    // Width/height are set to unscaled (graph-space) dimensions; the CSS transform
    // scales them to match screen pixel size.
    this.canvasOverlayEl.style.display = 'block'
    this.canvasOverlayEl.style.left = `${geometry.x}px`
    this.canvasOverlayEl.style.top = `${geometry.y}px`
    this.canvasOverlayEl.style.width = `${geometry.width / scale}px`
    this.canvasOverlayEl.style.height = `${geometry.height / scale}px`
    this.canvasOverlayEl.style.transform = `scale(${scale})`
    this.canvasOverlayEl.style.transformOrigin = '0 0'
  }
}
