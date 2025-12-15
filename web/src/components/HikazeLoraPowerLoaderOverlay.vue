<template>
  <div class="hikaze-lora-power-loader" :style="rootStyle">
    <div class="header" :style="headerStyle">
      <div class="header__title">Hikaze LoRA Power Loader</div>
      <div v-if="parseError" class="header__error" :title="parseError">
        Invalid JSON
      </div>
    </div>

    <div class="table-wrap">
      <HikazeGrid
        :rows="doc.LoRAs"
        :columns="gridColumns"
        empty-text='No LoRAs. Click "Select..." to paste JSON.'
        :get-row-key="getRowKey"
      >
        <template #cell="{ row, column, index }">
          <template v-if="column.key === '__delete__'">
            <button
              type="button"
              class="cell-delete"
              @click="onDeletePlaceholder(row, index)"
            >
              X
            </button>
          </template>

          <template v-else-if="column.key === 'lora'">
            <span class="cell-lora" :title="row.name || row.full_path">
              {{ row.name || row.full_path || '(unnamed)' }}
            </span>
          </template>

          <template v-else-if="column.key === 'MStrength'">
            <span class="cell-strength" :title="String(row.MStrength ?? '')">
              {{ formatStrength(row.MStrength) }}
            </span>
          </template>

          <template v-else-if="column.key === 'CStrength'">
            <span class="cell-strength" :title="String(row.CStrength ?? '')">
              {{ formatStrength(row.CStrength) }}
            </span>
          </template>

          <template v-else-if="column.key === 'toggleOn'">
            <div class="cell-square">
              <input
                v-model="row.toggleOn"
                class="cell-check"
                type="checkbox"
                @change="commitNow"
              />
            </div>
          </template>
        </template>
      </HikazeGrid>
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
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

import HikazeGrid from './HikazeGrid.vue'
import type { LoRAListDocument } from '../injection/types'
import { pickNodeAccentColor, parseHex, parseRgb, toRgba, type RGB } from '../util/colors'
import { getVueNodeElement } from '../util/dom'
import {
  createEmptyLoRAListDocument,
  parseLoRAListJson,
  stringifyLoRAListDocument
} from '../util/lora'

/**
 * Node body overlay UI for `HikazeLoraPowerLoader`.
 *
 * Data flow:
 * - `loraJsonRef` is the authoritative text value (backed by the schema widget value).
 * - This component parses it and renders a simple table.
 * - Any edits must be committed via `commitJson(...)` so the widget value (and workflow JSON)
 *   stays in sync.
 */
/** Props are provided by the controller (`HikazeLoraPowerLoaderController`). */
const props = defineProps<{
  nodeId: string | number | null
  /**
   * Node width forwarded by the overlay/controller.
   * Currently unused (kept for future layout tuning).
   */
  nodeWidth: number | null
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

const doc = ref<LoRAListDocument>(createEmptyLoRAListDocument())
const parseError = ref<string | null>(null)

const lastCommittedJson = ref<string | null>(null)
let commitTimer: number | null = null

const gridColumns = [
  { key: '__delete__', label: '', align: 'center', width: 'var(--hikaze-cell-size)' },
  {
    key: 'lora',
    label: 'LoRA',
    align: 'left',
    getValue: (row: any) => String(row?.name ?? row?.full_path ?? ''),
  },
  { key: 'MStrength', label: 'Model', align: 'right', width: 'var(--hikaze-num-col-width)' },
  { key: 'CStrength', label: 'CLIP', align: 'right', width: 'var(--hikaze-num-col-width)' },
  { key: 'toggleOn', label: '', align: 'center', width: 'var(--hikaze-cell-size)' },
] as const

function getRowKey(row: any, index: number) {
  return row?.sha256 ?? row?.full_path ?? index
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
    overflow: 'hidden',
    '--hikaze-cell-size': '22px',
    '--hikaze-num-col-width': '5ch',
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

/** Reserved for future picker panel styling (currently unused). */
const panelStyle = computed<Record<string, string>>(() => {
  const rgb = accentRgb.value
  const border = rgb ? toRgba(rgb, 0.55) : 'rgba(255, 255, 255, 0.12)'
  return {
    border: `1px solid ${border}`
  }
})

/**
 * Keep `doc` synced from the canonical widget text (`loraJsonRef`).
 * The controller is responsible for keeping `loraJsonRef` in sync with widget.value.
 */
watch(
  () => String(props.loraJsonRef?.value ?? ''),
  (raw) => {
    if (lastCommittedJson.value != null && raw === lastCommittedJson.value) {
      parseError.value = null
      return
    }

    const trimmed = raw.trim()
    if (!trimmed) {
      doc.value = createEmptyLoRAListDocument()
      parseError.value = null
      return
    }

    try {
      doc.value = parseLoRAListJson(trimmed)
      parseError.value = null
    } catch (e: any) {
      parseError.value = String(e?.message ?? e ?? 'Invalid JSON')
    }
  },
  { immediate: true }
)

/**
 * Placeholder for an interactive picker (file dialog / database view / etc).
 * Currently unused; kept as a future integration point.
 */
function openPicker() {
  const current = String(props.loraJsonRef?.value ?? '').trim()
  const defaultValue =
    current.length > 0 ? current : stringifyLoRAListDocument(PLACEHOLDER_DOC)
  const next = window.prompt('Paste LoRA JSON', defaultValue)
  if (next == null) return
  props.commitJson(next)
}

/** Write the placeholder document into the node widget (persisted to workflow JSON). */
function writePlaceholderJson() {
  doc.value = {
    version: PLACEHOLDER_DOC.version,
    LoRAs: PLACEHOLDER_DOC.LoRAs.map((item) => ({ ...item })),
  }
  commitNow()
}

function commitNow() {
  const next = stringifyLoRAListDocument(doc.value)
  lastCommittedJson.value = next
  parseError.value = null
  props.commitJson(next)
}

function scheduleCommit() {
  if (commitTimer != null) {
    try {
      window.clearTimeout(commitTimer)
    } catch {
      // ignore
    }
  }

  commitTimer = window.setTimeout(() => {
    commitTimer = null
    commitNow()
  }, 200)
}

function formatStrength(value: unknown) {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return ''
  return num.toFixed(3)
}

function onDeletePlaceholder(_row: any, _index: number) {
  console.debug('TODO: delete LoRA row (placeholder)')
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
  if (commitTimer != null) {
    try {
      window.clearTimeout(commitTimer)
    } catch {
      // ignore
    }
    commitTimer = null
  }

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
  white-space: nowrap;
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
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
}

.cell-square {
  width: var(--hikaze-cell-size);
  height: var(--hikaze-cell-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cell-delete {
  width: var(--hikaze-cell-size);
  height: var(--hikaze-cell-size);
  border-radius: 8px;
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecf2;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.cell-delete:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cell-lora {
  display: block;
  width: 100%;
  padding: 0 8px;
  line-height: var(--hikaze-cell-size);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-strength {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  height: var(--hikaze-cell-size);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e8ecf2;
  border-radius: 8px;
  padding: 0 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: right;
  line-height: var(--hikaze-cell-size);
  white-space: nowrap;
  overflow: hidden;
}

.cell-check {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

:deep(.hikaze-grid tbody td) {
  height: var(--hikaze-cell-size);
  padding: 0;
}

:deep(.hikaze-grid th[data-col-key="__delete__"]),
:deep(.hikaze-grid td[data-col-key="__delete__"]),
:deep(.hikaze-grid th[data-col-key="toggleOn"]),
:deep(.hikaze-grid td[data-col-key="toggleOn"]) {
  padding: 0;
}

:deep(.hikaze-grid th[data-col-key="MStrength"]),
:deep(.hikaze-grid th[data-col-key="CStrength"]) {
  padding: 0 4px;
}

:deep(.hikaze-grid td[data-col-key="MStrength"]),
:deep(.hikaze-grid td[data-col-key="CStrength"]) {
  padding: 0;
  position: relative;
  overflow: hidden;
  contain: paint;
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


</style>
