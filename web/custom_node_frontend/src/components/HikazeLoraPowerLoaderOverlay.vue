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
    v-for="(row, index) in doc.loras"
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
      <div v-if="doc.loras.length === 0" class="empty-tip">
        No LoRAs loaded.
      </div>
    </div>
  </HikazeNodeFrame>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, inject } from 'vue'
import HikazeNodeFrame from './HikazeNodeFrame.vue'
import HikazeLoraListElement from './HikazeLoraListElement.vue'
import type { LoRAListDocument } from '../injection/types'
import type { ModalOptions, ModalResult } from '../injection/modalService'
import {
  parseLoRAListJson,
  stringifyLoRAListDocument
} from '../util/lora'

const props = defineProps<{
  nodeId: string | number
  payload: Ref<string>
  commit: (next: string) => void
}>()

const openManager = inject<(opts: ModalOptions) => Promise<ModalResult> | null>('openManager', null)

const PLACEHOLDER_DOC: LoRAListDocument = {
  version: 2,
  loras: [
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

const doc = ref<LoRAListDocument>({ version: 2, loras: [] })
const lastCommittedJson = ref<string | null>(null)

watch(
  () => String(props.payload?.value ?? ''),
  (raw) => {
    if (lastCommittedJson.value != null && raw === lastCommittedJson.value) {
      return
    }

    try {
      doc.value = parseLoRAListJson(raw || '')
    } catch (e) {
      console.error('Invalid JSON provided to Hikaze Lora Overlay')
      doc.value = JSON.parse(JSON.stringify(PLACEHOLDER_DOC))
    }
  },
  { immediate: true }
)

watch(doc, () => {
  const next = stringifyLoRAListDocument(doc.value)
  lastCommittedJson.value = next
  props.commit(next)
}, { deep: true })

function onMStrInput(seq: number, value: number) {
  const target = doc.value.loras?.[seq];
  if (target) target.strength_model = value;
}
function onCStrInput(seq: number, value: number) {
  const target = doc.value.loras?.[seq];
  if (target) target.strength_clip = value;
}
function onCheckboxInput(seq: number, value: boolean) {
  const target = doc.value.loras?.[seq];
  if (target) target.enabled = value;
}
function onBtnDelete(seq: number) {
  doc.value.loras?.splice(seq, 1);
}

function deleteAll() {
  if (confirm("Delete all LoRAs?")) {
    doc.value.loras = []
  }
}

function toggleAll(event: Event) {
  if (!doc.value.loras) return
  const checked = (event.target as HTMLInputElement).checked
  doc.value.loras.forEach((item) => {
    item.enabled = checked
  })
}

async function openPicker() {
  if (!openManager) {
    console.warn('openManager is not available')
    return
  }

  const result = await openManager({
    mode: 'multi',
    initialTab: 'loras',
    title: 'Select LoRAs'
  })

  if (!result || typeof result !== 'object' || !('loras' in result)) {
    return
  }

  props.commit(stringifyLoRAListDocument(result as LoRAListDocument))
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
