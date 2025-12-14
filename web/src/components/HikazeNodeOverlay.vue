<template>
  <div
    :style="{
      position: 'absolute',
      inset: '0',
      background: 'transparent',
      pointerEvents: 'none'
    }"
  ></div>

  <Teleport
    v-for="overlay in resolvedBodyOverlays"
    :key="overlay.key"
    :to="overlay.target"
  >
    <div
      :data-hikaze-body-overlay="overlay.key"
      :title="overlay.title"
      data-capture-wheel="true"
      :style="overlay.style"
      @pointerdown.stop
      @pointermove.stop
      @pointerup.stop
      @contextmenu.stop
      @click="overlay.onClick"
    >
      <component
        v-if="overlay.component"
        :is="overlay.component"
        v-bind="overlay.props"
      />
    </div>
  </Teleport>

  <Teleport
    v-for="overlay in resolvedWidgetOverlays"
    :key="overlay.key"
    :to="overlay.target"
  >
    <div
      :data-hikaze-overlay="overlay.key"
      :title="overlay.title"
      :style="{
        position: 'absolute',
        inset: '0',
        cursor: overlay.cursor,
        background: 'transparent',
        pointerEvents: 'auto'
      }"
      @click="overlay.onClick"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import type {
  NodeBodyOverlayDefinition,
  NodeBodyOverlayClickPayload,
  WidgetOverlayClickPayload,
  WidgetOverlayDefinition
} from '../injection/types'

type UnknownNode = {
  id?: string | number
  widgets?: Array<{
    name: string
    value: any
    callback?: (value: any) => void
  }>
}

const props = defineProps<{
  node: UnknownNode
  bodyOverlays?: NodeBodyOverlayDefinition[]
  widgetOverlays?: WidgetOverlayDefinition[]
}>()

type ResolvedBodyOverlay = {
  key: string
  title?: string
  cursor: string
  target: HTMLElement
  style: Record<string, string>
  component?: any
  props?: Record<string, any>
  onClick: (e: MouseEvent) => void
}

type ResolvedWidgetOverlay = {
  key: string
  title?: string
  cursor: string
  target: HTMLElement
  onClick: () => void
}

const resolvedWidgetOverlays = ref<ResolvedWidgetOverlay[]>([])
const resolvedBodyOverlays = ref<ResolvedBodyOverlay[]>([])
let resolveRetryTimer: number | null = null

function getVueNodeElement(nodeId: string | number) {
  return document.querySelector(`.lg-node[data-node-id="${nodeId}"]`)
}

function getVueNodeWidgetBodyElement(nodeId: string | number) {
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return null
  return nodeEl.querySelector('.lg-node-widgets') as HTMLElement | null
}

function findSchemaTextInput(nodeId: string | number, widgetName: string) {
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return null
  return nodeEl.querySelector(
    `input[aria-label="${widgetName}"]`
    ) as HTMLInputElement | null
}

function resolveAllOverlays(attemptsRemaining = 50) {
  const nodeId = props.node?.id
  const widgetOverlays = props.widgetOverlays ?? []
  const bodyOverlays = props.bodyOverlays ?? []

  if (nodeId == null) {
    resolvedWidgetOverlays.value = []
    resolvedBodyOverlays.value = []
    return
  }

  const widgets = props.node.widgets ?? []

  // Resolve node-body overlays (target = .lg-node-widgets)
  const bodyTarget = getVueNodeWidgetBodyElement(nodeId)
  const resolvedBodies: ResolvedBodyOverlay[] = []
  if (bodyTarget && bodyOverlays.length) {
    bodyTarget.style.position = bodyTarget.style.position || 'relative'

    for (const overlay of bodyOverlays) {
      const pointerEvents =
        overlay.pointerEvents ?? (overlay.onClick || overlay.component ? 'auto' : 'none')

      const style: Record<string, string> = {
        position: 'absolute',
        inset: '0',
        cursor: overlay.cursor ?? 'default',
        background: 'transparent',
        pointerEvents,
        zIndex: '60',
        ...(overlay.style ?? {})
      }

      const resolved: ResolvedBodyOverlay = {
        key: overlay.key,
        title: overlay.title,
        cursor: overlay.cursor ?? 'default',
        target: bodyTarget,
        style,
        component: overlay.component,
        props:
          typeof overlay.props === 'function'
            ? overlay.props({ node: props.node })
            : overlay.props,
        onClick: (e: MouseEvent) => {
          if (!overlay.onClick) return
          const payload: NodeBodyOverlayClickPayload = { node: props.node, e }
          overlay.onClick(payload)
        }
      }

      resolvedBodies.push(resolved)
    }
  }
  resolvedBodyOverlays.value = resolvedBodies

  const resolved: ResolvedWidgetOverlay[] = []
  for (const overlay of widgetOverlays) {
    const widget = widgets.find((w) => w.name === overlay.widgetName)
    if (!widget) continue

    const inputEl = findSchemaTextInput(nodeId, overlay.widgetName)
    if (!inputEl) continue

    try {
      if (overlay.patchInput?.readonly) {
        inputEl.setAttribute('readonly', 'readonly')
      }
      if (overlay.patchInput?.placeholder != null) {
        inputEl.setAttribute('placeholder', overlay.patchInput.placeholder)
      }
      if (overlay.patchInput?.cursor) {
        inputEl.style.cursor = overlay.patchInput.cursor
      }
    } catch {
      // ignore
    }

    const target = inputEl.parentElement ?? inputEl
    target.style.position = target.style.position || 'relative'

    const handler = () => {
      const payload: WidgetOverlayClickPayload = {
        node: props.node,
        widget,
        inputEl
      }
      overlay.onClick?.(payload)
    }

    resolved.push({
      key: overlay.key,
      title: overlay.title,
      cursor: overlay.patchInput?.cursor ?? 'pointer',
      target,
      onClick: handler
    })
  }

  resolvedWidgetOverlays.value = resolved

  const missingBodyOverlays = bodyOverlays.length > 0 && resolvedBodies.length === 0
  const missingWidgetOverlays =
    resolved.length < widgetOverlays.length && widgetOverlays.length > 0

  if ((missingBodyOverlays || missingWidgetOverlays) && attemptsRemaining > 0) {
    if (resolveRetryTimer != null) return
    resolveRetryTimer = window.setTimeout(() => {
      resolveRetryTimer = null
      resolveAllOverlays(attemptsRemaining - 1)
    }, 100)
  }
}

onMounted(() => {
  resolveAllOverlays()
})

onUnmounted(() => {
  if (resolveRetryTimer != null) {
    try {
      window.clearTimeout(resolveRetryTimer)
    } catch {
      // ignore
    }
    resolveRetryTimer = null
  }
})
</script>
