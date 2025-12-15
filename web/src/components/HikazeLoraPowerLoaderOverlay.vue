<template>
  <div class="hikaze-lora-power-loader" :style="rootStyle">
    <div class="header" :style="headerStyle">
      <div class="header__title">Hikaze LoRA Power Loader</div>
      <div v-if="parseError" class="header__error" :title="parseError">
        Invalid JSON
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="col-name">LoRA</th>
            <th class="col-num">Model</th>
            <th class="col-num">CLIP</th>
            <th class="col-flag">On</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx">
            <td class="col-name" :title="row.name">{{ row.name }}</td>
            <td class="col-num">{{ row.strengthModel }}</td>
            <td class="col-num">{{ row.strengthClip }}</td>
            <td class="col-flag">{{ row.enabled ? 'Y' : 'N' }}</td>
          </tr>
          <tr v-if="rows.length === 0">
            <td class="empty" colspan="4">
              No LoRAs. Click "Select..." to write placeholder JSON.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="openPicker">Select...</button>
      <button type="button" class="btn btn--ghost" @click="writePlaceholderJson">
        Write JSON
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'

import type { LoRAListDocument } from '../injection/types'

type LoraRow = {
  name: string
  strengthModel: number
  strengthClip: number
  enabled: boolean
}

const props = defineProps<{
  nodeId: string | number | null
  loraJsonRef: Ref<string>
  commitJson: (next: string) => void
}>()

const PLACEHOLDER_DOC: LoRAListDocument = {
  version: 1,
  LoRAs: [
    {
      name: 'example_lora_1',
      full_path: './example_lora_1.safetensors',
      MStrength: 1.0,
      CStrength: 1.0,
      sha256: '0123456789abcdef0123456789abcdef',
      toggleOn: true
    },
    {
      name: 'example_lora_2',
      full_path: './example_lora_2.safetensors',
      MStrength: 0.8,
      CStrength: 0.6,
      sha256: 'f123456789abcdef0123456789abcdef',
      toggleOn: true
    }
  ]
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(1, n))
}

type RGB = { r: number; g: number; b: number }

function parseRgb(color: string): RGB | null {
  const m = color
    .trim()
    .match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i)
  if (!m) return null
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
}

function parseHex(color: string): RGB | null {
  const hex = color.trim()
  if (!hex.startsWith('#')) return null
  const v = hex.slice(1)
  if (v.length === 3) {
    const r = parseInt(v[0] + v[0], 16)
    const g = parseInt(v[1] + v[1], 16)
    const b = parseInt(v[2] + v[2], 16)
    return { r, g, b }
  }
  if (v.length === 6) {
    const r = parseInt(v.slice(0, 2), 16)
    const g = parseInt(v.slice(2, 4), 16)
    const b = parseInt(v.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

function toRgba(rgb: RGB, alpha: number) {
  const a = clamp01(alpha)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

function isTransparent(color: string) {
  const v = color.trim().toLowerCase()
  return v === 'transparent' || v === 'rgba(0, 0, 0, 0)' || v === 'rgba(0,0,0,0)'
}

function pickNodeAccentColor(nodeEl: HTMLElement): string | null {
  try {
    const style = getComputedStyle(nodeEl)
    const vars = [
      '--node-color',
      '--comfy-node-color',
      '--lg-node-color',
      '--node-accent',
      '--node-accent-color'
    ]
    for (const key of vars) {
      const v = style.getPropertyValue(key).trim()
      if (v) return v
    }

    const header =
      (nodeEl.querySelector('.lg-node-header') as HTMLElement | null) ??
      (nodeEl.querySelector('.lg-node-titlebar') as HTMLElement | null) ??
      (nodeEl.querySelector('.lg-node-title') as HTMLElement | null)
    if (header) {
      const bg = getComputedStyle(header).backgroundColor
      if (bg && !isTransparent(bg)) return bg
    }

    const border = style.borderTopColor || style.borderColor
    if (border && !isTransparent(border)) return border
  } catch {
    // ignore
  }
  return null
}

const accentRaw = ref<string | null>(null)
const accentRgb = computed<RGB | null>(() => {
  const c = accentRaw.value
  if (!c) return null
  return parseRgb(c) ?? parseHex(c)
})

const rootStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const border = rgb ? toRgba(rgb, 0.65) : 'rgba(255, 255, 255, 0.08)'
  return {
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
    overflow: 'hidden'
  }
})

const headerStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const bg = rgb ? toRgba(rgb, 0.22) : 'rgba(255, 255, 255, 0.06)'
  const border = rgb ? toRgba(rgb, 0.35) : 'rgba(255, 255, 255, 0.1)'
  return {
    background: bg,
    border: `1px solid ${border}`
  }
})

const panelStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const border = rgb ? toRgba(rgb, 0.55) : 'rgba(255, 255, 255, 0.12)'
  return {
    border: `1px solid ${border}`
  }
})

const parseError = computed<string | null>(() => {
  const raw = String(props.loraJsonRef?.value ?? '').trim()
  if (!raw) return null
  try {
    JSON.parse(raw)
    return null
  } catch (e: any) {
    return String(e?.message ?? e ?? 'Invalid JSON')
  }
})

function coerceNumber(v: any, fallback: number) {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}

function normalizeRows(parsed: any): LoraRow[] {
  const entries = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.LoRAs)
      ? parsed.LoRAs
      : Array.isArray(parsed?.LoRAList)
        ? parsed.LoRAList
        : parsed?.loras
  if (!Array.isArray(entries)) return []

  const rows: LoraRow[] = []
  for (const item of entries) {
    if (!item || typeof item !== 'object') continue
    const name =
      String((item as any).name ?? (item as any).full_path ?? '').trim() ||
      '(unnamed)'
    const strengthModel = coerceNumber(
      (item as any).strength_model ?? (item as any).MStrength,
      1
    )
    const strengthClip = coerceNumber(
      (item as any).strength_clip ?? (item as any).CStrength,
      1
    )
    const enabledRaw = (item as any).enabled ?? (item as any).toggleOn
    const enabled = typeof enabledRaw === 'boolean' ? enabledRaw : enabledRaw !== false
    rows.push({ name, strengthModel, strengthClip, enabled })
  }
  return rows
}

const rows = computed<LoraRow[]>(() => {
  const raw = String(props.loraJsonRef?.value ?? '').trim()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return normalizeRows(parsed)
  } catch {
    return []
  }
})

function openPicker() {
  console.debug("placeholder openPicker")
}

function writePlaceholderJson() {
  props.commitJson(JSON.stringify(PLACEHOLDER_DOC, null, 2))
}

let observer: MutationObserver | null = null

function refreshAccent() {
  const nodeId = props.nodeId
  if (nodeId == null) return
  const nodeEl = document.querySelector(
    `.lg-node[data-node-id="${nodeId}"]`
  ) as HTMLElement | null
  if (!nodeEl) return

  const accent = pickNodeAccentColor(nodeEl)
  accentRaw.value = accent
}

onMounted(() => {
  refreshAccent()

  const nodeId = props.nodeId
  if (nodeId == null) return

  const nodeEl = document.querySelector(
    `.lg-node[data-node-id="${nodeId}"]`
  ) as HTMLElement | null
  if (!nodeEl) return

  observer = new MutationObserver(() => refreshAccent())
  observer.observe(nodeEl, { attributes: true, attributeFilter: ['style', 'class'] })
})

onUnmounted(() => {
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
.hikaze-lora-power-loader {
  color: #e8ecf2;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 6px 10px;
  gap: 10px;
}

.header__title {
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.2px;
  user-select: none;
}

.header__error {
  font-size: 11px;
  color: #ffb2b2;
  border: 1px solid rgba(255, 178, 178, 0.35);
  background: rgba(255, 178, 178, 0.08);
  padding: 2px 8px;
  border-radius: 999px;
}

.table-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table thead th {
  position: sticky;
  top: 0;
  background: rgba(15, 17, 23, 0.92);
  color: #aab3c4;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  font-size: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 8px;
  text-align: left;
  user-select: none;
}

.table tbody td {
  padding: 7px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.col-name {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-num,
.col-flag {
  width: 52px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.col-flag {
  width: 34px;
}

.empty {
  color: #aab3c4;
  padding: 12px 10px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e8ecf2;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn--ghost {
  background: transparent;
}

.picker {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 10px;
}

.picker__panel {
  width: min(560px, 92%);
  height: min(420px, 92%);
  background: rgba(15, 17, 23, 0.98);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
}

.picker__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.picker__title {
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.25px;
}

.picker__close {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecf2;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.picker__iframe {
  flex: 1;
  width: 100%;
  border: 0;
  background: #0f1117;
}

.picker__actions {
  padding: 10px 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
