<template>
  <div class="hikaze-node-shell" :style="rootStyle">
    <!-- Header Area -->
    <div class="header" :style="headerStyle" v-if="title || $slots.header">
      <div class="header__title">
        <slot name="header">{{ title }}</slot>
      </div>
      <div v-if="error" class="header__error" :title="error">
        {{ error }}
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="body-wrap" :class="{ 'has-actions': $slots.actions }">
      <slot />
    </div>

    <!-- Actions/Footer Area -->
    <div class="actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type CSSProperties } from 'vue'
import { pickNodeAccentColor, parseHex, parseRgb, toRgba, type RGB } from '../util/colors'
import { getVueNodeElement } from '../util/dom'

const props = defineProps<{
  nodeId?: string | number | null
  title?: string
  error?: string | null
}>()

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
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgb(38 39 41)',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
    '--hikaze-cell-size': '22px',
    '--hikaze-num-col-width': '5ch',
    color: '#e8ecf2',
    pointerEvents: 'auto'
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

let observer: MutationObserver | null = null

/**
 * Refresh accent color from the current node element (best-effort).
 * Called on mount and when node style/class changes.
 */
function refreshAccent() {
  const nodeId = props.nodeId
  if (nodeId == null) return
  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return

  const accent = pickNodeAccentColor(nodeEl)
  accentRaw.value = accent
}

onMounted(() => {
  // Initial accent computation (DOM should exist in VueNodes mode).
  refreshAccent()

  const nodeId = props.nodeId
  if (nodeId == null) return

  const nodeEl = getVueNodeElement(nodeId)
  if (!nodeEl) return

  // Observe node DOM for color/theme changes so our overlay stays visually consistent.
  observer = new MutationObserver(() => refreshAccent())
  observer.observe(nodeEl, { attributes: true, attributeFilter: ['style', 'class'] })
})

onUnmounted(() => {
  // Cleanup observer to avoid leaking references after graph switches.
  if (observer) {
    try {
      observer.disconnect()
    } catch {
      // ignore
    }
    observer = null
  }
})
</script>

<style scoped>
.hikaze-node-shell {
  /* Default font settings */
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

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-shrink: 0;
  padding-top: 4px;
  /* Slight separation from body */
}
</style>
