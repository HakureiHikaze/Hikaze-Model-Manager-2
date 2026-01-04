import type { LoRAEntry, LoRAListDocument } from '@shared/types/lora_list'

/**
 * Shared types for Hikaze injection layer.
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
  | 'graph-loaded'

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
  key: string
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
  key: string
  title?: string
  cursor?: string
  pointerEvents?: 'auto' | 'none'
  style?: Record<string, string>
  component?: any
  props?: Record<string, any> | ((payload: { node: any }) => Record<string, any>)
  onClick?: (payload: NodeBodyOverlayClickPayload) => void
}

export type { LoRAEntry, LoRAListDocument }