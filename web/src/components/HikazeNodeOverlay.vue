<template>
  <div
    :style="{
      position: 'absolute',
      inset: '0',
      background: 'transparent',
      pointerEvents: 'none'
    }"
  />

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
  widgetOverlays?: WidgetOverlayDefinition[]
}>()

type ResolvedWidgetOverlay = {
  key: string
  title?: string
  cursor: string
  target: HTMLElement
  onClick: () => void
}

const resolvedWidgetOverlays = ref<ResolvedWidgetOverlay[]>([])
let resolveRetryTimer: number | null = null

function getVueNodeElement(nodeId: string | number) {
  return document.querySelector(`.lg-node[data-node-id="${nodeId}"]`)
}

function findSchemaTextInput(nodeId: string | number, widgetName: string) {
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return null
  return nodeEl.querySelector(
    `input[aria-label="${widgetName}"]`
  ) as HTMLInputElement | null
}

function resolveWidgetOverlays(attemptsRemaining = 50) {
  const nodeId = props.node?.id
  const overlays = props.widgetOverlays ?? []
  if (nodeId == null || overlays.length === 0) {
    resolvedWidgetOverlays.value = []
    return
  }

  const widgets = props.node.widgets ?? []

  const resolved: ResolvedWidgetOverlay[] = []
  for (const overlay of overlays) {
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

  if (resolved.length < overlays.length && attemptsRemaining > 0) {
    if (resolveRetryTimer != null) return
    resolveRetryTimer = window.setTimeout(() => {
      resolveRetryTimer = null
      resolveWidgetOverlays(attemptsRemaining - 1)
    }, 100)
  }
}

onMounted(() => {
  resolveWidgetOverlays()
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
