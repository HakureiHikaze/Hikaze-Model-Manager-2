<template>
  <!-- No Shell wrapper here, HikazeNodeFrame handles it. -->
  <div class="hikaze-lora-content">
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
import { onUnmounted, ref, watch, type Ref } from 'vue'

import HikazeGrid from './HikazeGrid.vue'
import type { LoRAListDocument } from '../injection/types'
import {
  createEmptyLoRAListDocument,
  parseLoRAListJson,
  stringifyLoRAListDocument
} from '../util/lora'

const props = defineProps<{
  nodeId: string | number
  payload: Ref<string>
  commit: (next: string) => void
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

watch(
  () => String(props.payload?.value ?? ''),
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

function openPicker() {
  const current = String(props.payload?.value ?? '').trim()
  const defaultValue =
    current.length > 0 ? current : stringifyLoRAListDocument(PLACEHOLDER_DOC)
  const next = window.prompt('Paste LoRA JSON', defaultValue)
  if (next == null) return
  props.commit(next)
}

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
  props.commit(next)
}

function formatStrength(value: unknown) {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return ''
  return num.toFixed(3)
}

function onDeletePlaceholder(_row: any, _index: number) {
  console.debug('TODO: delete LoRA row (placeholder)')
}

onUnmounted(() => {
  if (commitTimer != null) {
    try {
      window.clearTimeout(commitTimer)
    } catch {
      // ignore
    }
    commitTimer = null
  }
})
</script>

<style scoped>
.hikaze-lora-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
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
  flex-shrink: 0;
  padding-top: 4px;
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
