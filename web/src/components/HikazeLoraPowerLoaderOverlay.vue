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
import { pickNodeAccentColor, parseHex, parseRgb, toRgba, type RGB } from '../util/colors'
import { getVueNodeElement } from '../util/dom'
import { coerceNumber } from '../util/numbers'

/**
 * Node body overlay UI for `HikazeLoraPowerLoader`.
 *
 * Data flow:
 * - `loraJsonRef` is the authoritative text value (backed by the schema widget value).
 * - This component parses it and renders a simple table.
 * - Any edits must be committed via `commitJson(...)` so the widget value (and workflow JSON)
 *   stays in sync.
 */
type LoraRow = {
  name: string
  strengthModel: number
  strengthClip: number
  enabled: boolean
}

/** Props are provided by the controller (`HikazeLoraPowerLoaderController`). */
const props = defineProps<{
  nodeId: string | number | null
  loraJsonRef: Ref<string>
  commitJson: (next: string) => void
}>()

/**
 * Placeholder document for development/testing.
 * "Write JSON" will serialize this object into the node's `lora_json` widget.
 */
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

/** Raw accent color string extracted from the current node element. */
const accentRaw = ref<string | null>(null)
/** Parsed RGB value of `accentRaw` when possible. */
const accentRgb = computed<RGB | null>(() => {
  const c = accentRaw.value
  if (!c) return null
  return parseRgb(c) ?? parseHex(c)
})

/** Root panel style; uses the node accent color when available. */
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

/** Header style; uses a translucent version of the accent color. */
const headerStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const bg = rgb ? toRgba(rgb, 0.22) : 'rgba(255, 255, 255, 0.06)'
  const border = rgb ? toRgba(rgb, 0.35) : 'rgba(255, 255, 255, 0.1)'
  return {
    background: bg,
    border: `1px solid ${border}`
  }
})

/**
 * Reserved for future picker panel styling (currently unused).
 * Kept so we can add a richer picker UI later without reworking accent logic.
 */
const panelStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const border = rgb ? toRgba(rgb, 0.55) : 'rgba(255, 255, 255, 0.12)'
  return {
    border: `1px solid ${border}`
  }
})

/** Validate JSON and expose an error string for UI; does not parse schema deeply. */
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

/**
 * Normalize various JSON shapes into rows for display.
 *
 * Supported inputs:
 * - Array form: `[ { ... } ]`
 * - Document form: `{ LoRAs: [...] }` or `{ LoRAList: [...] }` (legacy key)
 * - Legacy form: `{ loras: [...] }`
 *
 * Field compatibility:
 * - strengths: `strength_model/strength_clip` or `MStrength/CStrength`
 * - enabled: `enabled` or `toggleOn`
 */
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

/** Reactive table rows derived from `loraJsonRef`. */
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

/**
 * Placeholder for an interactive picker (file dialog / database view / etc).
 * Currently unused; kept as a future integration point.
 */
function openPicker() {
  console.debug("placeholder openPicker")
}

/** Write the placeholder document into the node widget (persisted to workflow JSON). */
function writePlaceholderJson() {
  props.commitJson(JSON.stringify(PLACEHOLDER_DOC, null, 2))
}

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
