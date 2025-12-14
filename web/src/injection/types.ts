export type InjectionMode = 'vue' | 'legacy'

export type InjectionReason =
  | 'startup'
  | 'node-created'
  | 'node-added'
  | 'loaded-graph-node'
  | 'graph-changed'
  | 'collapse-changed'
  | 'mode-changed'
  | 'manual-reload'

export interface InjectionContext {
  mode: InjectionMode
  reason: InjectionReason | (string & {})
  app: any | null
  graph: any | null
}

export const HIKAZE_NODE_TYPE_PREFIX = 'Hikaze'

export const VUE_NODES_SETTING_ID = 'Comfy.VueNodes.Enabled'
export const VUE_NODES_SETTING_EVENT = `${VUE_NODES_SETTING_ID}.change`

export interface WidgetOverlayInputPatch {
  readonly?: boolean
  placeholder?: string
  cursor?: string
}

export interface WidgetOverlayClickPayload {
  node: any
  widget: any
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
