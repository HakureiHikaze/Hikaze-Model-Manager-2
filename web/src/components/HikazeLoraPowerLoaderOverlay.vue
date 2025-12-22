<template>
  <div class="hikaze-lora-content">
    <!-- UI content removed for refactoring. -->
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, type Ref } from 'vue'

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
</style>
