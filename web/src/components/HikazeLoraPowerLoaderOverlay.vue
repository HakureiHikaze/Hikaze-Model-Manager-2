<template>
  <HikazeNodeFrame :node-id="nodeId" title="Hikaze LoRA Power Loader">
    <template #header-actions>
      <button type="button" class="btn header-action-btn" @click="openPicker">
        Select LoRAs...
      </button>
    </template>

    <div class="hikaze-lora-content">
      <table class="loRA-list-table">
        <thead>
          <th>
            <button class="header-btn" @click="deleteAll" title="Delete All">&#128465;</button>
          </th>
          <th>Seq</th>
          <th>LoRA</th>
          <th>Mstr</th>
          <th>Cstr</th>
          <th>
            <div class="header-chk-wrap" title="Toggle All">
              On
              <input
                class="hikaze-reset-chk"
                type="checkbox"
                @change="toggleAll"
              />
            </div>
          </th>
        </thead>
        <tbody>
        <HikazeLoraListElement
          v-for="(row, index) in doc.LoRAs"
          :key="index"
          :seq="index"
          :name="row.full_path"
          :strength_model="row.strength_model"
          :strength_clip="row.strength_clip"
          :enabled="row.enabled"
          @update:strength_model="onMStrInput"
          @update:strength_clip="onCStrInput"
          @update:enabled="onCheckboxInput"
          @update:delete="onBtnDelete"
        />
        </tbody>
      </table>
      <div v-if="doc.LoRAs.length === 0" class="empty-tip">
        No LoRAs loaded.
      </div>
    </div>
  </HikazeNodeFrame>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import HikazeNodeFrame from './HikazeNodeFrame.vue'
import HikazeLoraListElement from './HikazeLoraListElement.vue'
import type { LoRAListDocument, LoRAEntry } from '../injection/types'
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
      strength_model: 1.0,
      strength_clip: 1.0,
      sha256: '0123456789abcdef0123456789abcdef',
      enabled: true
    },
    {
      name: 'example_lora_2',
      full_path: './example_lora_2.safetensors',
      strength_model: 0.8,
      strength_clip: 0.6,
      sha256: 'f123456789abcdef0123456789abcdef',
      enabled: true
    }
  ]
}

const doc = ref<LoRAListDocument>({ version: 1, LoRAs: [] })
const lastCommittedJson = ref<string | null>(null)

watch(
  () => String(props.payload?.value ?? ''),
  (raw) => {
    if (lastCommittedJson.value != null && raw === lastCommittedJson.value) {
      return
    }

    try {
      const parsed = JSON.parse(raw || '{}')
      // Basic validation/migration
      if (Array.isArray(parsed.LoRAs)) {
        // Map old keys if necessary (though backend supports alias, frontend UI needs strict keys)
        // Since we changed types.ts, we assume data matches or we fix it.
        // For now, assume data is correct or empty.
        // If data is from old version (MStrength), we might need migration here?
        // Let's implement a simple migration for robustness.
        parsed.LoRAs.forEach((item: any) => {
            if (item.MStrength !== undefined && item.strength_model === undefined) item.strength_model = item.MStrength
            if (item.CStrength !== undefined && item.strength_clip === undefined) item.strength_clip = item.CStrength
            if (item.toggleOn !== undefined && item.enabled === undefined) item.enabled = item.toggleOn
        })
        doc.value = parsed
      } else {
        // Init with placeholder if empty/invalid structure
        doc.value = JSON.parse(JSON.stringify(PLACEHOLDER_DOC))
        // Auto-commit placeholder? Maybe not automatically to avoid overwriting user intent.
      }
    } catch (e) {
      console.error("Invalid JSON provided to Hikaze Lora Overlay")
    }
  },
  { immediate: true }
)

watch(doc, () => {
    const next = JSON.stringify(doc.value)
    lastCommittedJson.value = next
    props.commit(next)
}, { deep: true })

function onMStrInput(seq: number, value: number) {
  const target = doc.value.LoRAs?.[seq];
  if (target) target.strength_model = value;
}
function onCStrInput(seq: number, value: number) {
  const target = doc.value.LoRAs?.[seq];
  if (target) target.strength_clip = value;
}
function onCheckboxInput(seq: number, value: boolean) {
  const target = doc.value.LoRAs?.[seq];
  if (target) target.enabled = value;
}
function onBtnDelete(seq: number) {
  doc.value.LoRAs?.splice(seq, 1);
}

function deleteAll() {
  if (confirm("Delete all LoRAs?")) {
    doc.value.LoRAs = []
  }
}

function toggleAll(event: Event) {
  if (!doc.value.LoRAs) return
  const checked = (event.target as HTMLInputElement).checked
  doc.value.LoRAs.forEach((item) => {
    item.enabled = checked
  })
}

function openPicker() {
  const current = String(props.payload?.value ?? '').trim()
  const defaultValue =
    current.length > 0 ? current : stringifyLoRAListDocument(PLACEHOLDER_DOC)
  const next = window.prompt('Paste LoRA JSON', defaultValue)
  if (next == null) return
  props.commit(next)
}
</script>

<style scoped>
.hikaze-lora-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow: auto;
}

.loRA-list-table {
  background-color: rgba(0, 0, 0, 0.2);
  border-collapse: collapse;
  border-radius: 5px;
  width: 100%;
  color: #e8ecf2;
}

.loRA-list-table thead {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.loRA-list-table th {
  padding: 8px 4px;
  font-size: 12px;
  text-align: center;
}

.empty-tip {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
}

.header-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ff6666;
  font-size: 14px;
  padding: 0;
}
.header-btn:hover {
  color: #ff3333;
}

.header-chk-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

/* Reusing Defensive CSS for Checkbox in Header */
input.hikaze-reset-chk {
  appearance: auto;
  margin: 0 !important;
  width: 14px !important;
  height: 14px !important;
  cursor: pointer !important;
  filter: none !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
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

.header-action-btn {
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.header-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
