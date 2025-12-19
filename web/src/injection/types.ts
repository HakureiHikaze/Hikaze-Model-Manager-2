/**
 * Shared types for Hikaze injection layer.
 *
 * These types are used by:
 * - injection manager (`manager.ts`)
 * - controllers (`controllers/*`)
 * - overlay renderer component (`components/HikazeNodeOverlay.vue`)
 */
export type InjectionMode = 'vue' | 'legacy'

/**
 * Why injection happened (used for debugging/logging; may affect controller behavior).
 */
export type InjectionReason =
  | 'startup'
  | 'node-created'
  | 'node-added'
  | 'loaded-graph-node'
  | 'graph-changed'
  | 'collapse-changed'
  | 'mode-changed'
  | 'manual-reload'
  | 'setup'
  | 'graph-node-added'

export interface InjectionContext {
  /** Current UI rendering mode. */
  mode: InjectionMode
  /** Why we are injecting right now. */
  reason: InjectionReason | (string & {})
  /** ComfyUI app instance (best-effort; may be null during early startup). */
  app: any | null
  /** Active graph instance (best-effort; may be null during early startup). */
  graph: any | null
}

/** Node type prefix used to decide whether a node should be handled by this plugin. */
export const HIKAZE_NODE_TYPE_PREFIX = 'Hikaze'

export const VUE_NODES_SETTING_ID = 'Comfy.VueNodes.Enabled'
export const VUE_NODES_SETTING_EVENT = `${VUE_NODES_SETTING_ID}.change`

export interface WidgetOverlayInputPatch {
  readonly?: boolean
  placeholder?: string
  cursor?: string
}

export interface WidgetOverlayClickPayload {
  /** LiteGraph node instance. */
  node: any
  /** Matching widget object (by `widget.name`). */
  widget: any
  /** DOM input element (schema widget), if found. */
  inputEl: HTMLInputElement | null
}

export interface WidgetOverlayDefinition {
  /**
   * Unique key for rendering / debugging.
   */
  key: string
  /**
   * Schema-defined input id (widget.name).
   */
  widgetName: string
  title?: string
  patchInput?: WidgetOverlayInputPatch
  onClick?: (payload: WidgetOverlayClickPayload) => void
}

export interface NodeBodyOverlayClickPayload {
  node: any
  e: MouseEvent
}

export interface NodeBodyOverlayDefinition {
  /**
   * Unique key for rendering / debugging.
   */
  key: string
  title?: string
  cursor?: string
  /**
   * Controls whether this overlay can receive pointer events.
   * Defaults to 'auto' when `onClick` or `component` is present, otherwise 'none'.
   */
  pointerEvents?: 'auto' | 'none'
  /**
   * Extra CSS applied to the overlay root (which is always absolute/inset:0).
   */
  style?: Record<string, string>
  /**
   * Optional Vue component to render inside the overlay.
   */
  component?: any
  /**
   * Props to pass to `component`.
   */
  props?: Record<string, any> | ((payload: { node: any }) => Record<string, any>)
  onClick?: (payload: NodeBodyOverlayClickPayload) => void
}

export interface LoRAEntry {
  /**
   * LoRA list element (Hikaze schema).
   */
  name?: string
  full_path: string
  MStrength: number
  CStrength: number
  sha256?: string
  toggleOn: boolean
}

export interface LoRAListDocument {
  /**
   * LoRA list document shape (Hikaze schema).
   */
  version: number
  LoRAs: Array<LoRAEntry>
}
