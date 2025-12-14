<template>
  <div
    :style="{
      position: 'absolute',
      inset: '0',
      background: 'transparent',
      pointerEvents: 'none'
    }"
  />

  <!-- Example: attach a clickable overlay to the schema-defined text widget. -->
  <Teleport v-if="ckptOverlayTarget" :to="ckptOverlayTarget">
    <div
      data-hikaze-overlay="ckpt_path"
      title="Click to select a checkpoint path"
      :style="{
        position: 'absolute',
        inset: '0',
        cursor: 'pointer',
        background: 'transparent',
        pointerEvents: 'auto'
      }"
      @click="handleCkptPick"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type UnknownNode = {
  id?: string | number
  widgets?: Array<{
    name: string
    value: any
    callback?: (value: any) => void
  }>
  onResize?: () => void
  graph?: {
    setDirtyCanvas?: (fg: boolean, bg: boolean) => void
  }
}

const props = defineProps<{
  node: UnknownNode
}>()

const ckptOverlayTarget = ref<HTMLElement | null>(null)
let ckptWidget:
  | {
      name: string
      value: any
      callback?: (value: any) => void
    }
  | undefined
let ckptInputEl: HTMLInputElement | null = null

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

function setWidgetValue(node: UnknownNode, widget: any, next: string) {
  widget.value = next
  widget.callback?.(next)

  try {
    if (ckptInputEl) ckptInputEl.value = next
  } catch {
    // ignore
  }

  node.onResize?.()
  node.graph?.setDirtyCanvas?.(true, true)
}

function handleCkptPick() {
  if (!ckptWidget) return
  const current = String(ckptWidget.value ?? '')
  const next = window.prompt('Enter absolute checkpoint path', current)
  if (next != null && next !== current) {
    setWidgetValue(props.node, ckptWidget, next)
  }
}

onMounted(() => {
  const nodeId = props.node?.id
  if (nodeId == null) return

  ckptWidget = props.node.widgets?.find((w) => w.name === 'ckpt_path')
  if (!ckptWidget) return

  const inputEl = findSchemaTextInput(nodeId, ckptWidget.name)
  if (!inputEl) return
  ckptInputEl = inputEl

  const target = inputEl.parentElement ?? inputEl
  if (target.querySelector('[data-hikaze-overlay="ckpt_path"]')) return

  // Hint: keep the visual consistent but prevent free typing.
  try {
    inputEl.setAttribute('readonly', 'readonly')
    inputEl.setAttribute('placeholder', 'Click to select')
    inputEl.style.cursor = 'pointer'
  } catch {
    // ignore
  }

  target.style.position = target.style.position || 'relative'
  ckptOverlayTarget.value = target
})
</script>
