<template>
  <div class="hikaze-lora-content">
    <table class="loRA-list-table">
      <thead>
        <th>Del?</th>
        <th>Seq</th>
        <th>LoRA</th>
        <th>Mstr</th>
        <th>Cstr</th>
        <th>On</th>
      </thead>
      <tbody>
        <HikazeLoraListElement
          v-for="(row, index) in doc.LoRAs"
          :key="index"
          :seq="index"
          :name="row.full_path"
          :mstr="row.strength_model"
          :cstr="row.strength_clip"
          :on="row.enabled"
          @update:mstr="onMStrInput"
          @update:cstr="onCStrInput"
          @update:on="onCheckboxInput"
          @update:delete="onBtnDelete"
        />
      </tbody>
    </table>
    <div v-if="doc.LoRAs.length === 0" class="empty-tip">
      No LoRAs loaded.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import HikazeLoraListElement from './HikazeLoraListElement.vue'
import type { LoRAListDocument, LoRAEntry } from '../injection/types'

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
</style>
