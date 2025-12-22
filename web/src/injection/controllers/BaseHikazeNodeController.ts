/**
 * Base controller for Hikaze nodes (front-end injection layer).
 *
 * This controller enforces a standardized architecture:
 * - A single `HikazeNodeFrame` is mounted to the node.
 * - State is synced via a standard `hikaze_payload` widget.
 * - Subclasses provide the Vue component and optional props.
 */
import { createApp, h, ref, type App as VueApp, type Ref } from 'vue'

import HikazeNodeFrame from '../../components/HikazeNodeFrame.vue'
import { getVueNodeWidgetBodyElement } from '../../util/dom'
import type { InjectionContext, InjectionMode } from '../types'

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

    if (ctx.mode === 'vue') {
      this.ensureFrameMounted(ctx)
    } else {
      // Legacy mode: Hook widget click to open simplified editor placeholder
      this.hookLegacyWidgetClick(PAYLOAD_WIDGET, (current) =>
        window.prompt('Hikaze Payload (JSON)', current)
      )
    }

    this.injectedMode = ctx.mode
  }

  reinject(ctx: InjectionContext) {
    this.dispose()
    this.inject(ctx)
  }

  dispose() {
    this.clearHydrationSync()
    this.unhookWidgetChange()

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

    // In VueNodes mode, we mount to a dummy host, and Frame teleports itself.
    // We attach the dummy host to body or somewhere stable, or just create it in memory?
    // Vue 3 requires the host to be in DOM for some features, but Teleport works from anywhere usually.
    // To be safe, let's append our host to the node body if possible, or document.body.
    // Actually, getting the node body is what Frame does.
    // So we can just create a host div, append it to document.body (hidden), and mount.
    
    if (this.vueApp) return

    const host = document.createElement('div')
    host.style.display = 'none' // Hidden host
    document.body.appendChild(host)
    this.vueHost = host

    const app = createApp({
      render: () =>
        h(this.getComponent(), {
          nodeId: nodeId,
          title: this.getTitle(), // Pass title to Overlay if it wraps Frame
          ...this.getComponentProps(),
          // Standard props passed to all child components
          payload: this.payloadRef,
          commit: (v: string) => this.commitPayload(v)
        })
    })
    
    app.mount(host)
    this.vueApp = app
  }
}
