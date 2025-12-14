import type { InjectionContext, InjectionMode, InjectionReason } from './types'
import {
  HIKAZE_NODE_TYPE_PREFIX,
  VUE_NODES_SETTING_EVENT,
  VUE_NODES_SETTING_ID
} from './types'
import { BaseHikazeNodeController } from './controllers/BaseHikazeNodeController'

type UnknownApp = any
type UnknownNode = any

type ManagerOptions = {
  extName: string
  getComfyApp: () => UnknownApp
}

const HAS_OWN: (obj: any, key: string) => boolean =
  Object.hasOwn ?? ((obj, key) => Object.prototype.hasOwnProperty.call(obj, key))

const ON_ADDED_HOOK_FLAG = '__hikazeOnAddedHooked'
const SETTINGS_HOOK_FLAG = '__hikazeVueNodesSettingHooked'

export class HikazeInjectionManager {
  private readonly extName: string
  private readonly getComfyApp: () => UnknownApp

  private controllersByNode = new WeakMap<object, BaseHikazeNodeController>()
  private controllers = new Set<BaseHikazeNodeController>()
  private graphChangeListenerInstalled = false

  constructor(options: ManagerOptions) {
    this.extName = options.extName
    this.getComfyApp = options.getComfyApp
  }

  install() {
    this.installVueNodesSettingListener()
    this.installGraphChangeListener()
  }

  onNodeCreated(node: UnknownNode) {
    if (!this.isHikazeNode(node)) return
    this.ensureOnAddedHook(node)
    this.injectNode(node, 'node-created')
  }

  onLoadedGraphNode(node: UnknownNode) {
    if (!this.isHikazeNode(node)) return
    this.injectNode(node, 'loaded-graph-node')
  }

  reinjectAll(reason: InjectionReason = 'manual-reload') {
    this.reinjectAllForMode(this.getCurrentMode(), reason)
  }

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

    for (const node of nodes) {
      if (!this.isHikazeNode(node)) continue
      this.reinjectNode(node, ctx)
    }
  }

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

  private reinjectNode(node: UnknownNode, ctx: InjectionContext) {
    const controller = this.getOrCreateController(node)
    controller.reinject(ctx)
  }

  private getOrCreateController(node: UnknownNode) {
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

    if (HAS_OWN(settings, SETTINGS_HOOK_FLAG)) return
    this.defineHiddenFlag(settings, SETTINGS_HOOK_FLAG)

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

    canvasEl.addEventListener(
      'litegraph:set-graph',
      () => {
        this.disposeAllControllers()
        this.reinjectAllForMode(this.getCurrentMode(), 'graph-changed')
      },
      { passive: true }
    )
  }

  private ensureOnAddedHook(node: UnknownNode) {
    if (!node || typeof node !== 'object') return
    if (HAS_OWN(node, ON_ADDED_HOOK_FLAG)) return
    this.defineHiddenFlag(node, ON_ADDED_HOOK_FLAG)

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

  private defineHiddenFlag(obj: any, key: string) {
    try {
      Object.defineProperty(obj, key, {
        value: true,
        enumerable: false,
        configurable: true
      })
      return
    } catch {
      // ignore
    }

    try {
      obj[key] = true
    } catch {
      // ignore
    }
  }

  private getCurrentMode(): InjectionMode {
    const mode = (globalThis as any)?.LiteGraph?.vueNodesMode
    if (typeof mode === 'boolean') return mode ? 'vue' : 'legacy'
    return document.querySelector("[data-testid='transform-pane']") ? 'vue' : 'legacy'
  }

  private getActiveGraph(app: UnknownApp) {
    return app?.canvas?.graph ?? app?.graph ?? (globalThis as any)?.graph ?? null
  }

  private getGraphNodes(graph: any): UnknownNode[] | null {
    const nodes = graph?._nodes ?? graph?.nodes
    return Array.isArray(nodes) ? nodes : null
  }

  private getNodeType(node: UnknownNode): string | null {
    const t = node?.comfyClass ?? node?.type
    return typeof t === 'string' && t.length ? t : null
  }

  private isHikazeNode(node: UnknownNode): boolean {
    const nodeType = this.getNodeType(node)
    return !!nodeType && nodeType.startsWith(HIKAZE_NODE_TYPE_PREFIX)
  }
}
