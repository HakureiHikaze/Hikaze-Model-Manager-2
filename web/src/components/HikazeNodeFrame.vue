<template>
  <Teleport v-if="target" :to="target">
    <div
      class="hikaze-node-frame"
      :style="rootStyle"
      @pointerdown.stop
      @pointermove.stop
      @pointerup.stop
      @contextmenu.stop
    >
      <!-- Header -->
      <div class="header" :style="headerStyle" v-if="title">
        <div class="header__title">{{ title }}</div>
        <div v-if="error" class="header__error" :title="error">{{ error }}</div>
      </div>

      <!-- Body Component -->
      <div class="body-wrap">
        <component
          v-if="component"
          :is="component"
          v-bind="componentProps"
          :node-id="nodeId"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type CSSProperties } from 'vue'

import { getVueNodeWidgetBodyElement, getVueNodeElement } from '../util/dom'
import { pickNodeAccentColor, parseHex, parseRgb, toRgba, type RGB } from '../util/colors'

const props = defineProps<{
  nodeId: string | number
  title?: string
  error?: string | null
  component: any
  componentProps?: Record<string, any>
}>()

const target = ref<HTMLElement | null>(null)
let retryTimer: number | null = null
let observer: MutationObserver | null = null

/** Raw accent color string extracted from the current node element. */
const accentRaw = ref<string | null>(null)

/** Parsed RGB value of `accentRaw` when possible. */
const accentRgb = computed<RGB | null>(() => {
  const c = accentRaw.value
  if (!c) return null
  return parseRgb(c) ?? parseHex(c)
})

/** Root panel style; uses the node accent color when available. */
const rootStyle = computed<CSSProperties>(() => {
  const rgb = accentRgb.value
  const border = rgb ? toRgba(rgb, 0.65) : 'rgba(255, 255, 255, 0.08)'
  return {
    position: 'absolute',
    inset: '0',
    zIndex: '60',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(15, 17, 23, 0.92)',
    border: `1px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
    '--hikaze-cell-size': '22px',
    '--hikaze-num-col-width': '5ch',
    color: '#e8ecf2',
    pointerEvents: 'auto',
    cursor: 'default'
  }
})

/** Header style; uses a translucent version of the accent color. */
const headerStyle = computed<CSSProperties>(() => {
  const rgb = accentRgb.value
  const bg = rgb ? toRgba(rgb, 0.22) : 'rgba(255, 255, 255, 0.06)'
  const border = rgb ? toRgba(rgb, 0.35) : 'rgba(255, 255, 255, 0.1)'
  return {
    background: bg,
    border: `1px solid ${border}`
  }
})

/**
 * Resolve the target DOM element to teleport into.
 * In VueNodes mode, this is `.lg-node-widgets`.
 */
function resolveTarget(attempts = 100) {
  const el = getVueNodeWidgetBodyElement(props.nodeId)
  if (el) {
    // Ensure the container is positioned correctly
    el.style.position = el.style.position || 'relative'
    el.style.width = '100%'
    el.style.height = '100%' // Ensure it fills the space
    target.value = el
    refreshAccent()
    return
  }

  if (attempts > 0) {
    retryTimer = window.setTimeout(() => resolveTarget(attempts - 1), 100)
  }
}

function refreshAccent() {
  const nodeEl = getVueNodeElement(props.nodeId)
  if (!nodeEl) return
  accentRaw.value = pickNodeAccentColor(nodeEl)
  
  // Setup observer if not already done
  if (!observer) {
    observer = new MutationObserver(() => refreshAccent())
    observer.observe(nodeEl, { attributes: true, attributeFilter: ['style', 'class'] })
  }
}

onMounted(() => {
  resolveTarget()
})

onUnmounted(() => {
  if (retryTimer) clearTimeout(retryTimer)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.hikaze-node-frame {
  font-family: sans-serif;
  font-size: 13px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 6px 10px;
  gap: 10px;
  flex-shrink: 0;
}

.header__title {
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.2px;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__error {
  font-size: 11px;
  color: #ffb2b2;
  border: 1px solid rgba(255, 178, 178, 0.35);
  background: rgba(255, 178, 178, 0.08);
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.body-wrap {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
