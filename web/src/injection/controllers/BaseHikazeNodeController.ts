import { createApp, type App as VueApp } from 'vue'

import HikazeNodeOverlay from '../../components/HikazeNodeOverlay.vue'
import type {
  InjectionContext,
  InjectionMode,
  WidgetOverlayDefinition
} from '../types'

type UnknownNode = {
  id?: string | number
  type?: string
  comfyClass?: string
  widgets?: Array<any>
  onResize?: () => void
  graph?: {
    _version?: number
    setDirtyCanvas?: (fg: boolean, bg: boolean) => void
  }
  onWidgetChanged?: (
    name: string,
    value: any,
    oldValue: any,
    widget: any
  ) => void
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

  private injectedMode: InjectionMode | null = null
  private cleanupFns: Array<() => void> = []

  private vueOverlay:
    | {
        host: HTMLDivElement
        app: VueApp
      }
    | null = null

  private vueMountRetryTimer: number | null = null

  private legacyWidgetPointerDownOriginal = new WeakMap<object, any>()

  constructor(node: UnknownNode) {
    this.node = node
  }

  inject(ctx: InjectionContext) {
    if (this.injectedMode && this.injectedMode !== ctx.mode) {
      this.dispose()
    }

    if (ctx.mode === 'vue') {
      this.ensureVueOverlayMounted(ctx)
    } else {
      this.onInjectLegacy(ctx)
    }

    this.injectedMode = ctx.mode
  }

  reinject(ctx: InjectionContext) {
    this.dispose()
    this.inject(ctx)
  }

  dispose() {
    if (this.vueMountRetryTimer != null) {
      try {
        window.clearTimeout(this.vueMountRetryTimer)
      } catch {
        // ignore
      }
      this.vueMountRetryTimer = null
    }

    for (let i = this.cleanupFns.length - 1; i >= 0; i--) {
      try {
        this.cleanupFns[i]?.()
      } catch {
        // ignore
      }
    }
    this.cleanupFns = []

    this.vueOverlay = null
    this.injectedMode = null
    this.legacyWidgetPointerDownOriginal = new WeakMap<object, any>()
  }

  protected getVueWidgetOverlays(_ctx: InjectionContext): WidgetOverlayDefinition[] {
    return []
  }

  protected onInjectLegacy(_ctx: InjectionContext) {
    // Default: no legacy behavior modifications.
  }

  protected findWidget(widgetName: string) {
    const widgets = this.node?.widgets
    if (!Array.isArray(widgets)) return null
    return widgets.find((w) => w?.name === widgetName) ?? null
  }

  protected setWidgetValue(
    widget: any,
    next: any,
    options?: { inputEl?: HTMLInputElement | null; e?: any; canvas?: any }
  ) {
    const oldValue = widget?.value
    if (next === oldValue) return

    const node = this.node
    const e = options?.e
    const canvas = options?.canvas

    if (canvas && typeof widget?.setValue === 'function') {
      try {
        widget.setValue(next, { e, node, canvas })
      } catch {
        // fall back
      }
    }

    if (widget?.value !== next) {
      try {
        widget.value = next
      } catch {
        // ignore
      }

      try {
        const pos = canvas?.graph_mouse
        widget.callback?.(widget.value, canvas, node, pos, e)
      } catch {
        // ignore
      }

      try {
        node?.onWidgetChanged?.(widget.name ?? '', widget.value, oldValue, widget)
      } catch {
        // ignore
      }

      try {
        if (node?.graph) node.graph._version = (node.graph._version ?? 0) + 1
      } catch {
        // ignore
      }
    }

    try {
      if (options?.inputEl) options.inputEl.value = String(next ?? '')
    } catch {
      // ignore
    }

    try {
      node?.onResize?.()
    } catch {
      // ignore
    }
    try {
      node?.graph?.setDirtyCanvas?.(true, true)
    } catch {
      // ignore
    }
  }

  protected hookLegacyTextWidgetClick(
    widgetName: string,
    onPick: (current: string) => string | null
  ) {
    const widget = this.findWidget(widgetName)
    if (!widget || typeof widget !== 'object') return
    if (this.legacyWidgetPointerDownOriginal.has(widget)) return

    const originalOnPointerDown = widget.onPointerDown
    this.legacyWidgetPointerDownOriginal.set(widget, originalOnPointerDown)

    widget.onPointerDown = (pointer: any, nodeFromCanvas: any, canvas: any) => {
      if (typeof originalOnPointerDown === 'function') {
        try {
          const handled = originalOnPointerDown.call(
            widget,
            pointer,
            nodeFromCanvas,
            canvas
          )
          if (handled) return true
        } catch {
          // ignore
        }
      }

      const effectiveNode = nodeFromCanvas ?? this.node

      const priorFinally = pointer?.finally
      if (pointer && canvas) {
        pointer.finally = () => {
          try {
            if (typeof priorFinally === 'function') priorFinally()
          } finally {
            try {
              canvas.node_widget = null
            } catch {
              // ignore
            }
          }
        }
      }

      const handlePick = () => {
        const current = String(widget.value ?? '')
        const next = onPick(current)
        if (next != null && next !== current) {
          const e = pointer?.eUp ?? pointer?.eDown ?? null
          this.setWidgetValue(widget, next, { e, canvas })
        }
      }

      if (pointer) {
        pointer.onClick = handlePick
      } else {
        handlePick()
      }

      return true
    }

    this.cleanupFns.push(() => {
      try {
        widget.onPointerDown = originalOnPointerDown
      } catch {
        // ignore
      }
      this.legacyWidgetPointerDownOriginal.delete(widget)
    })
  }

  private scheduleVueMountRetry(fn: () => void, delayMs: number) {
    if (this.vueMountRetryTimer != null) return
    this.vueMountRetryTimer = window.setTimeout(() => {
      this.vueMountRetryTimer = null
      try {
        fn()
      } catch {
        // ignore
      }
    }, delayMs)
  }

  private getVueNodeElement(nodeId: string | number) {
    return document.querySelector(
      `.lg-node[data-node-id="${nodeId}"]`
    ) as HTMLElement | null
  }

  private getVueNodeWidgetBodyElement(nodeId: string | number) {
    const nodeEl = this.getVueNodeElement(nodeId)
    if (!nodeEl) return null
    return nodeEl.querySelector('.lg-node-widgets') as HTMLElement | null
  }

  private ensureVueOverlayMounted(ctx: InjectionContext, attemptsRemaining = 50) {
    const nodeId = this.node?.id
    if (nodeId == null) {
      if (attemptsRemaining <= 0) return
      this.scheduleVueMountRetry(
        () => this.ensureVueOverlayMounted(ctx, attemptsRemaining - 1),
        50
      )
      return
    }

    const bodyEl = this.getVueNodeWidgetBodyElement(nodeId)
    if (!bodyEl) {
      if (attemptsRemaining <= 0) return
      this.scheduleVueMountRetry(
        () => this.ensureVueOverlayMounted(ctx, attemptsRemaining - 1),
        100
      )
      return
    }

    if (this.vueOverlay?.host?.isConnected) return

    // Remove orphaned hosts for this node, if any.
    try {
      bodyEl
        .querySelectorAll("[data-hikaze-node-overlay-host='1']")
        .forEach((el) => el.remove())
    } catch {
      // ignore
    }

    bodyEl.style.position = bodyEl.style.position || 'relative'

    const host = document.createElement('div')
    host.dataset.hikazeNodeOverlayHost = '1'
    host.dataset.hikazeNodeId = String(nodeId)
    host.style.position = 'absolute'
    host.style.inset = '0'
    host.style.zIndex = '50'
    host.style.pointerEvents = 'none'

    bodyEl.appendChild(host)

    const widgetOverlays = this.getVueWidgetOverlays(ctx)
    const app = createApp(HikazeNodeOverlay, { node: this.node, widgetOverlays })
    app.mount(host)

    this.vueOverlay = { host, app }

    this.cleanupFns.push(() => {
      try {
        app.unmount()
      } catch {
        // ignore
      }
      try {
        host.remove()
      } catch {
        // ignore
      }
    })
  }
}
