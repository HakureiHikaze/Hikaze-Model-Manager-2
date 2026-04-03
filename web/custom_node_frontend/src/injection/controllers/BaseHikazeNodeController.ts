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

    // Create or reuse Vue app
    if (!this.vueApp) {
      const host = document.createElement('div')
      host.setAttribute('data-hikaze-node-overlay-host', '1')
      host.style.display = 'none' // Hidden initially
      document.body.appendChild(host)
      this.vueHost = host

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
      app.mount(host)
      this.vueApp = app
    }

    // Mode-specific mounting
    if (ctx.mode === 'vue') {
      this.mountVueMode(ctx)
    } else {
      this.mountLegacyMode(ctx)
    }
  }

  /**
   * Mount in VueNodes mode: HikazeNodeFrame will teleport to node's DOM.
   */
  private mountVueMode(ctx: InjectionContext) {
    // In VueNodes mode, the host can remain hidden.
    // HikazeNodeFrame component handles teleporting to .lg-node-widgets
    if (this.vueHost) {
      this.vueHost.style.display = 'none'
    }
    this.stopPositionSync() // No need for position sync in VueNodes mode
  }

  /**
   * Mount in Legacy Canvas mode: Create absolute-positioned overlay.
   */
  private mountLegacyMode(ctx: InjectionContext) {
    // Get overlay container (canvas parent)
    const container = getOverlayContainer(this.node.id!, 'legacy', this.app)
    if (!container) {
      console.warn('[Hikaze] Failed to get overlay container for node', this.node.id)
      return
    }

    // Create or reuse overlay element
    if (!this.canvasOverlayEl) {
      const overlay = document.createElement('div')
      overlay.setAttribute('data-hikaze-canvas-overlay', '1')
      overlay.setAttribute('data-node-id', String(this.node.id))
      overlay.style.position = 'fixed'
      overlay.style.pointerEvents = 'auto'
      overlay.style.zIndex = '1000'
      overlay.style.overflow = 'hidden'
      container.appendChild(overlay)
      this.canvasOverlayEl = overlay

      // Mount Vue app to overlay
      if (this.vueHost && this.vueApp) {
        // Re-mount to the overlay
        this.vueApp.unmount()
        this.vueApp.mount(overlay)
        this.vueHost.remove()
        this.vueHost = overlay
      }
    } else {
      // Ensure overlay is visible
      this.canvasOverlayEl.style.display = 'block'
    }

    // Start position synchronization
    this.startPositionSync()
  }

  /**
   * Start synchronizing overlay position with canvas node position.
   */
  private startPositionSync() {
    this.stopPositionSync()

    // Initial position update
    this.syncOverlayPosition()

    // Sync on animation frame for smooth tracking
    const syncLoop = () => {
      if (!this.canvasOverlayEl) return
      this.syncOverlayPosition()
      this.positionSyncTimer = window.requestAnimationFrame(syncLoop)
    }
    this.positionSyncTimer = window.requestAnimationFrame(syncLoop)

    // Also sync on window resize and scroll
    const onViewportChange = () => this.syncOverlayPosition()
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
    this.cleanupFns.push(() => {
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
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

    const geometry = this.positionAdapter.getGeometry()
    if (!geometry) {
      // Hide overlay if geometry cannot be determined
      this.canvasOverlayEl.style.display = 'none'
      return
    }

    // Show and position overlay
    this.canvasOverlayEl.style.display = 'block'
    this.canvasOverlayEl.style.left = `${geometry.x}px`
    this.canvasOverlayEl.style.top = `${geometry.y}px`
    this.canvasOverlayEl.style.width = `${geometry.width}px`
    this.canvasOverlayEl.style.height = `${geometry.height}px`
  }
}
