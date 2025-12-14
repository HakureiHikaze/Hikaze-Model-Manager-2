export type InjectionMode = 'vue' | 'legacy'

export type InjectionReason =
  | 'startup'
  | 'node-created'
  | 'node-added'
  | 'loaded-graph-node'
  | 'graph-changed'
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

