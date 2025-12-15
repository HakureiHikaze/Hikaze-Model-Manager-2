/**
 * Base controller for Hikaze nodes (front-end injection layer).
 *
 * A controller is created per LiteGraph node instance. It is responsible for:
 * - VueNodes mode: mounting a Vue overlay host and rendering overlays/components
 * - Legacy mode: optionally patching widget interactions (pointer handlers)
 *
 * Subclasses typically override:
 * - `getVueBodyOverlays` / `getVueWidgetOverlays`
 * - `onInjectLegacy`
 */
import { createApp, type App as VueApp } from 'vue'

import HikazeNodeOverlay from '../../components/HikazeNodeOverlay.vue'
import { getVueNodeWidgetBodyElement } from '../../util/dom'
import type {
  InjectionContext,
  InjectionMode,
  NodeBodyOverlayDefinition,
  WidgetOverlayDefinition
} from '../types'

type UnknownNode = {
  /** LiteGraph node id. */
  id?: string | number
  /** Node type name (legacy). */
  type?: string
  /** Node type name (ComfyUI-specific alias). */
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
  /**
   * Global registry: node type -> controller constructor.
   * Controllers are registered via side-effect imports (see `registerControllers.ts`).
   */
  static readonly registry = new Map<string, HikazeNodeControllerConstructor>()

  /** Register a controller implementation for a given node type. */
  static register(nodeType: string, ctor: HikazeNodeControllerConstructor) {
    this.registry.set(nodeType, ctor)
  }

  /** Resolve the controller implementation for a node type (if registered). */
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

  /** Bind this controller to a specific node instance. */
  constructor(node: UnknownNode) {
    this.node = node
  }

  /**
   * Perform injection for the given context.
   * If mode changes (legacy <-> vue), prior resources are disposed first.
   */
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

  /** Dispose and inject again for the given context. */
  reinject(ctx: InjectionContext) {
    this.dispose()
    this.inject(ctx)
  }

  /**
   * Dispose any UI/hooks created by this controller.
   *
   * This should be idempotent: safe to call multiple times.
   */
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

  /**
   * VueNodes mode: overlays that attach to a specific schema widget input.
   * Useful for "click to open picker" while keeping the value persisted in widget.value.
   */
  protected getVueWidgetOverlays(_ctx: InjectionContext): WidgetOverlayDefinition[] {
    return []
  }

  /**
   * VueNodes mode: overlays that cover the node body area (usually `.lg-node-widgets`).
   * Can be a transparent click-catcher or a full Vue component.
   */
  protected getVueBodyOverlays(_ctx: InjectionContext): NodeBodyOverlayDefinition[] {
    return []
  }

  /** Legacy mode injection hook. Default: no changes. */
  protected onInjectLegacy(_ctx: InjectionContext) {
    // Default: no legacy behavior modifications.
  }

  /** Find a widget by schema input id (widget.name). */
  protected findWidget(widgetName: string) {
    const widgets = this.node?.widgets
    if (!Array.isArray(widgets)) return null
    return widgets.find((w) => w?.name === widgetName) ?? null
  }

  /**
   * Update a widget value while keeping ComfyUI/LiteGraph state consistent.
   *
   * This method tries to:
   * - call widget.setValue(...) when available (legacy path)
   * - invoke widget.callback to let ComfyUI update internal state
   * - call node.onWidgetChanged so other listeners can sync
   * - bump graph version and mark canvas dirty so changes persist to workflow JSON
   */
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

    // Prefer widget.setValue(...) when we have a LiteGraph canvas reference.
    if (canvas && typeof widget?.setValue === 'function') {
      try {
        widget.setValue(next, { e, node, canvas })
      } catch {
        // fall back
      }
    }

    // If setValue didn't take effect (or not available), do a best-effort manual update.
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

    // If caller also knows the DOM input element, keep it in sync to avoid UI mismatch.
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

  /**
   * Legacy mode helper: turn a text widget into a "click to pick" widget.
   *
   * Example: clicking a text input opens `window.prompt(...)` and commits the result.
   */
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

  /**
   * Schedule a single retry for Vue overlay mounting.
   * Prevents multiple overlapping timeouts.
   */
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

  /**
   * VueNodes mode: mount the overlay host element for this node and render `HikazeNodeOverlay`.
   *
   * Notes:
   * - Node DOM may not exist immediately after graph load; this method retries briefly.
   * - The host itself is pointer-events:none; individual overlays can opt into pointer events.
   */
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

    const bodyEl = getVueNodeWidgetBodyElement(nodeId)
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

    // Absolute layer that acts as Teleport host for overlays.
    const host = document.createElement('div')
    host.dataset.hikazeNodeOverlayHost = '1'
    host.dataset.hikazeNodeId = String(nodeId)
    host.style.position = 'absolute'
    host.style.inset = '0'
    host.style.zIndex = '50'
    host.style.pointerEvents = 'none'

    bodyEl.appendChild(host)

    // Overlays are provided by the controller subclass.
    const bodyOverlays = this.getVueBodyOverlays(ctx)
    const widgetOverlays = this.getVueWidgetOverlays(ctx)
    const app = createApp(HikazeNodeOverlay, {
      node: this.node,
      bodyOverlays,
      widgetOverlays
    })
    app.mount(host)

    this.vueOverlay = { host, app }

    // Cleanup on dispose.
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
