<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  activeTab?: string
}>()

const toolbarRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })

const DEFAULT_MARGIN = 24
const EDGE_PADDING = 8
let lastPosition: { x: number; y: number } | null = null

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getBounds = () => {
  const el = toolbarRef.value
  if (!el) {
    return { width: 0, height: 0, maxX: 0, maxY: 0 }
  }
  const rect = el.getBoundingClientRect()
  const maxX = Math.max(0, window.innerWidth - rect.width - EDGE_PADDING)
  const maxY = Math.max(0, window.innerHeight - rect.height - EDGE_PADDING)
  return { width: rect.width, height: rect.height, maxX, maxY }
}

const setPosition = (x: number, y: number) => {
  const { maxX, maxY } = getBounds()
  position.value = {
    x: clamp(x, EDGE_PADDING, maxX),
    y: clamp(y, EDGE_PADDING, maxY)
  }
}

const initPosition = async () => {
  await nextTick()
  if (!toolbarRef.value) return
  if (lastPosition) {
    setPosition(lastPosition.x, lastPosition.y)
    return
  }
  const { width, height } = getBounds()
  const x = Math.max(EDGE_PADDING, (window.innerWidth - width) / 2)
  const y = Math.max(EDGE_PADDING, window.innerHeight - height - DEFAULT_MARGIN)
  setPosition(x, y)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  const x = event.clientX - dragOffset.value.x
  const y = event.clientY - dragOffset.value.y
  setPosition(x, y)
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  lastPosition = { ...position.value }
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
  document.body.style.userSelect = ''
}

const startDrag = (event: PointerEvent) => {
  if (!toolbarRef.value) return
  const rect = toolbarRef.value.getBoundingClientRect()
  dragOffset.value = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  isDragging.value = true
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
  document.body.style.userSelect = 'none'
}

const handleResize = () => {
  setPosition(position.value.x, position.value.y)
}

onMounted(() => {
  initPosition()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  endDrag()
})

const positionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`
}))
</script>

<template>
  <div
    ref="toolbarRef"
    class="floating-toolbar"
    :class="{ 'is-dragging': isDragging }"
    :style="positionStyle"
    :data-active-tab="activeTab || ''"
    role="toolbar"
    aria-label="Floating toolbar"
  >
    <div
      class="toolbar-handle"
      aria-hidden="true"
      @pointerdown="startDrag"
    ></div>
    <div class="toolbar-actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.floating-toolbar {
  position: fixed;
  z-index: 2000;
  min-width: 160px;
  padding: 10px 14px 12px;
  border: 1px solid #30363d;
  border-radius: 10px;
  background: rgba(15, 17, 21, 0.85);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  color: #c9d1d9;
  display: flex;
  flex-direction: column;
  gap: 10px;
  touch-action: none;
}

.toolbar-handle {
  width: 48px;
  height: 6px;
  background: #30363d;
  border-radius: 999px;
  margin: 0 auto;
  cursor: grab;
}

.floating-toolbar.is-dragging .toolbar-handle {
  cursor: grabbing;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 24px;
}
</style>
