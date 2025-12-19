/**
 * Hikaze front-end injection manager.
 *
 * This module runs inside ComfyUI's browser UI as a registered extension.
 * It reacts to:
 * - node creation / workflow load
 * - graph switching
 * - VueNodes mode switching
 *
 * Then it delegates per-node UI work to `BaseHikazeNodeController` (or a
 * node-specific subclass from the controller registry).
 */
import type { InjectionContext, InjectionMode, InjectionReason } from './types'
import {
  HIKAZE_NODE_TYPE_PREFIX,
  VUE_NODES_SETTING_EVENT,
  VUE_NODES_SETTING_ID
} from './types'
import { BaseHikazeNodeController } from './controllers/BaseHikazeNodeController'
import { defineHiddenFlag, hasOwn } from '../util/object'

type UnknownApp = any
type UnknownNode = any

type ManagerOptions = {
  /**
   * Extension name for logging.
   */
  extName: string
  /**
   * Getter for the ComfyUI app instance (global differs across builds).
   */
  getComfyApp: () => UnknownApp
}

/**
 * Internal flags added onto ComfyUI objects to avoid double-hooking.
 * These are defined as non-enumerable properties.
 */
const ON_ADDED_HOOK_FLAG = '__hikazeOnAddedHooked'
const COLLAPSE_HOOK_FLAG = '__hikazeCollapseHooked'
const SETTINGS_HOOK_FLAG = '__hikazeVueNodesSettingHooked'
const GRAPH_HOOK_FLAG = '__hikazeGraphHooked'

/**
 * Coordinates injection across all Hikaze nodes in the active graph.
 */
export class HikazeInjectionManager {
  private readonly extName: string
  private readonly getComfyApp: () => UnknownApp

  private controllersByNode = new WeakMap<object, BaseHikazeNodeController>()
  private controllers = new Set<BaseHikazeNodeController>()
  private graphChangeListenerInstalled = false
  private collapseReinjectTimers = new WeakMap<object, number>()

  /**
   * Create the manager; call `install()` once ComfyUI app exists.
   */
  constructor(options: ManagerOptions) {
    this.extName = options.extName
    this.getComfyApp = options.getComfyApp
  }

  /**
   * Install global event listeners (mode switches + graph switches).
   */
  install() {
    this.installVueNodesSettingListener()
    this.installGraphChangeListener()
  }

  /**
   * ComfyUI callback: user created a node (context menu / paste / etc).
   */
  onNodeCreated(node: UnknownNode) {
    if (!this.isHikazeNode(node)) return
    this.ensureOnAddedHook(node)
    this.injectNode(node, 'node-created')
  }

  /**
   * ComfyUI callback: node created while loading a workflow/graph.
   */
  onLoadedGraphNode(node: UnknownNode) {
    if (!this.isHikazeNode(node)) return
    this.injectNode(node, 'loaded-graph-node')
  }

  /**
   * Reinject all Hikaze nodes in the active graph (debug/manual reload).
   */
  reinjectAll(reason: InjectionReason = 'manual-reload') {
    this.reinjectAllForMode(this.getCurrentMode(), reason)
  }

  /**
   * Reinject all Hikaze nodes for a specific UI mode.
   * Retries briefly if graph is not ready yet (startup / mode switching).
   */
  reinjectAllForMode(
    mode: InjectionMode,
    reason: InjectionReason,
    attemptsRemaining = 20
  ) {
    const app = this.getComfyApp()
    const graph = this.getActiveGraph(app)
    const ctx: InjectionContext = { mode, reason, app, graph }

    const nodes = this.getGraphNodes(graph)
    if (!nodes) {
      // Graph may not be ready yet (startup / mode switch). Retry briefly.
      if (attemptsRemaining <= 0) return
      window.setTimeout(
        () => this.reinjectAllForMode(mode, reason, attemptsRemaining - 1),
        150
      )
      return
    }

    // Ensure we are hooked into the active graph events
    this.hookGraphNodeAdded(graph)

    for (const node of nodes) {
      if (!this.isHikazeNode(node)) continue
      this.reinjectNode(node, ctx)
    }
  }

  /**
   * Inject a single node by creating a context snapshot and delegating to its controller.
   */
  private injectNode(node: UnknownNode, reason: InjectionReason) {
    const app = this.getComfyApp()
    const graph = this.getActiveGraph(app)
    const ctx: InjectionContext = {
      mode: this.getCurrentMode(),
      reason,
      app,
      graph
    }

    const controller = this.getOrCreateController(node)
    controller.inject(ctx)
  }

  /**
   * Force re-injection of a node for an existing context.
   */
  private reinjectNode(node: UnknownNode, ctx: InjectionContext) {
    const controller = this.getOrCreateController(node)
    controller.reinject(ctx)
  }

  /**
   * Reinject a single node by constructing a fresh context snapshot.
   */
  private reinjectSingleNode(node: UnknownNode, reason: InjectionReason) {
    const app = this.getComfyApp()
    const graph = this.getActiveGraph(app)
    const ctx: InjectionContext = {
      mode: this.getCurrentMode(),
      reason,
      app,
      graph
    }

    this.reinjectNode(node, ctx)
  }

  /**
   * If a node already has a controller, dispose it and release resources/DOM.
   */
  private disposeControllerIfExists(node: UnknownNode) {
    if (!node || typeof node !== 'object') return
    const controller = this.controllersByNode.get(node)
    if (!controller) return
    try {
      controller.dispose()
    } catch {
      // ignore
    }
  }

  /**
   * Schedule a reinjection on the next tick (debounced per-node).
   *
   * Used after un-collapsing a node: ComfyUI recreates DOM, then we mount overlays again.
   */
  private scheduleReinjectSingleNode(node: UnknownNode, reason: InjectionReason) {
    if (!node || typeof node !== 'object') return

    const existing = this.collapseReinjectTimers.get(node)
    if (existing != null) {
      try {
        window.clearTimeout(existing)
      } catch {
        // ignore
      }
    }

    const timer = window.setTimeout(() => {
      this.collapseReinjectTimers.delete(node)

      if (!this.isHikazeNode(node)) return
      if (node?.flags?.collapsed) return

      this.reinjectSingleNode(node, reason)
    }, 0)

    this.collapseReinjectTimers.set(node, timer)
  }

  /**
   * Resolve (and memoize) the controller for a node instance.
   * Controller type is looked up by node type name (`node.type` / `node.comfyClass`).
   */
  private getOrCreateController(node: UnknownNode) {
    this.ensureCollapseHook(node)

    if (node && typeof node === 'object') {
      const existing = this.controllersByNode.get(node)
      if (existing) return existing
    }

    const nodeType = this.getNodeType(node)
    const ctor =
      (nodeType ? BaseHikazeNodeController.resolve(nodeType) : undefined) ??
      BaseHikazeNodeController
    const controller = new ctor(node)

    if (node && typeof node === 'object') {
      this.controllersByNode.set(node, controller)
    }
    this.controllers.add(controller)
    return controller
  }

  /**
   * Dispose every controller and clear the registry for the active graph.
   */
  private disposeAllControllers() {
    for (const controller of this.controllers) {
      try {
        controller.dispose()
      } catch {
        // ignore
      }
    }
    this.controllers.clear()
    this.controllersByNode = new WeakMap<object, BaseHikazeNodeController>()

    // Best-effort cleanup for orphaned Vue overlay hosts (e.g., after mode switches).
    try {
      document
        .querySelectorAll("[data-hikaze-node-overlay-host='1']")
        .forEach((el) => el.remove())
    } catch {
      // ignore
    }
  }

  /**
   * Listen to VueNodes setting changes and reinject nodes after mode switches.
   */
  private installVueNodesSettingListener(attemptsRemaining = 40) {
    const app = this.getComfyApp()
    const settings = app?.ui?.settings
    if (!settings || typeof settings.addEventListener !== 'function') {
      if (attemptsRemaining <= 0) return
      window.setTimeout(
        () => this.installVueNodesSettingListener(attemptsRemaining - 1),
        250
      )
      return
    }

    if (hasOwn(settings, SETTINGS_HOOK_FLAG)) return
    defineHiddenFlag(settings, SETTINGS_HOOK_FLAG)

    settings.addEventListener(VUE_NODES_SETTING_EVENT, (event: any) => {
      const enabled = !!event?.detail?.value
      const mode: InjectionMode = enabled ? 'vue' : 'legacy'

      console.info(
        `[${this.extName}] ${VUE_NODES_SETTING_ID} -> ${String(enabled)}`
      )

      // Mode switching recreates the rendering layers. Reset our state and
      // reinject existing Hikaze nodes for the target mode.
      this.disposeAllControllers()

      // Let the frontend finish switching DOM/canvas layers first.
      window.setTimeout(() => {
        this.reinjectAllForMode(mode, 'mode-changed')
      }, 0)
    })
  }

  /**
   * Listen to LiteGraph "graph changed" event and reinject for the new graph.
   */
  private installGraphChangeListener(attemptsRemaining = 40) {
    const app = this.getComfyApp()
    const canvasEl = app?.canvas?.canvas
    if (!canvasEl || typeof canvasEl.addEventListener !== 'function') {
      if (attemptsRemaining <= 0) return
      window.setTimeout(
        () => this.installGraphChangeListener(attemptsRemaining - 1),
        250
      )
      return
    }

    if (this.graphChangeListenerInstalled) return
    this.graphChangeListenerInstalled = true

    // Try hooking current graph immediately
    const graph = this.getActiveGraph(app)
    if (graph) this.hookGraphNodeAdded(graph)

    canvasEl.addEventListener(
      'litegraph:set-graph',
      (e: any) => {
        // Hook the new graph immediately
        const newGraph = e.detail ?? this.getActiveGraph(app)
        if (newGraph) this.hookGraphNodeAdded(newGraph)

        // Delay reinjection slightly to allow ComfyUI/Vue to swap the DOM layers.
        // This prevents querying "stale" DOM elements from the previous graph.
        window.setTimeout(() => {
          this.disposeAllControllers()
          this.reinjectAllForMode(this.getCurrentMode(), 'graph-changed')
        }, 50)
      },
      { passive: true }
    )
  }

  /**
   * Hook `graph.onNodeAdded` to catch dynamically added nodes (library/paste).
   */
  private hookGraphNodeAdded(graph: any) {
    if (!graph || typeof graph !== 'object') return
    if (hasOwn(graph, GRAPH_HOOK_FLAG)) return
    defineHiddenFlag(graph, GRAPH_HOOK_FLAG)

    const originalOnNodeAdded = graph.onNodeAdded
    graph.onNodeAdded = (node: UnknownNode) => {
        try {
            if (typeof originalOnNodeAdded === 'function') {
                originalOnNodeAdded.call(graph, node)
            }
        } finally {
            if (this.isHikazeNode(node)) {
                this.injectNode(node, 'graph-node-added')
            }
        }
    }
  }

  /**
   * Ensure `node.onAdded` triggers injection (covers additional creation paths).
   */
  private ensureOnAddedHook(node: UnknownNode) {
    if (!node || typeof node !== 'object') return
    if (hasOwn(node, ON_ADDED_HOOK_FLAG)) return
    defineHiddenFlag(node, ON_ADDED_HOOK_FLAG)

    const originalOnAdded = node.onAdded
    node.onAdded = (graph: any) => {
      try {
        return typeof originalOnAdded === 'function'
          ? originalOnAdded.call(node, graph)
          : undefined
      } finally {
        this.injectNode(node, 'node-added')
      }
    }
  }

  /**
   * Ensure collapse/un-collapse transitions are handled:
   * - on collapse: dispose overlays so we don't hold stale DOM references
   * - on un-collapse: schedule a reinject for the next tick
   */
  private ensureCollapseHook(node: UnknownNode) {
    if (!node || typeof node !== 'object') return
    if (hasOwn(node, COLLAPSE_HOOK_FLAG)) return

    const originalCollapse = node.collapse
    if (typeof originalCollapse !== 'function') return

    defineHiddenFlag(node, COLLAPSE_HOOK_FLAG)

    node.collapse = (...args: any[]) => {
      const wasCollapsed = !!node?.flags?.collapsed
      try {
        return originalCollapse.call(node, ...args)
      } finally {
        const isCollapsed = !!node?.flags?.collapsed
        if (wasCollapsed === isCollapsed) {
          // no-op
        } else if (isCollapsed) {
          this.disposeControllerIfExists(node)
        } else {
          this.scheduleReinjectSingleNode(node, 'collapse-changed')
        }

        // Intentionally do not return from finally; preserve original return/throw.
      }
    }
  }

  /**
   * Detect current rendering mode (VueNodes vs legacy).
   */
  private getCurrentMode(): InjectionMode {
    const mode = (globalThis as any)?.LiteGraph?.vueNodesMode
    if (typeof mode === 'boolean') return mode ? 'vue' : 'legacy'
    return document.querySelector("[data-testid='transform-pane']") ? 'vue' : 'legacy'
  }

  /**
   * Best-effort resolve the currently active graph.
   */
  private getActiveGraph(app: UnknownApp) {
    return app?.canvas?.graph ?? app?.graph ?? (globalThis as any)?.graph ?? null
  }

  /**
   * Return node list for the given graph (LiteGraph uses different internal fields).
   */
  private getGraphNodes(graph: any): UnknownNode[] | null {
    const nodes = graph?._nodes ?? graph?.nodes
    return Array.isArray(nodes) ? nodes : null
  }

  /**
   * Resolve node type name. ComfyUI may set `comfyClass` or `type` depending on the path.
   */
  private getNodeType(node: UnknownNode): string | null {
    const t = node?.comfyClass ?? node?.type
    return typeof t === 'string' && t.length ? t : null
  }

  /**
   * Whether this node is managed by our injection system.
   * Convention: node type starts with `HIKAZE_NODE_TYPE_PREFIX`.
   */
  private isHikazeNode(node: UnknownNode): boolean {
    const nodeType = this.getNodeType(node)
    return !!nodeType && nodeType.startsWith(HIKAZE_NODE_TYPE_PREFIX)
  }
}
