<script setup lang="ts">
import { Teleport, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { modalState, closeManager } from '../injection/modalService'
import HikazeManagerLayout from '@manager/components/HikazeManagerLayout.vue'
import ModelLibrary from '@manager/components/ModelLibrary.vue'
import ModelDetails from '@manager/components/ModelDetails.vue'
import type { Model } from '@shared/types/model_record'
import type { LoRAListDocument } from '@shared/types/lora_list'

const selectedModel = ref<Model | undefined>(undefined)
const selectedModels = ref<Model[]>([])

const modalOptions = computed(() => modalState.options.value)
const isMultiSelect = computed(() => modalOptions.value?.mode === 'multi')
const modalTitle = computed(() => {
  return modalOptions.value?.title || (isMultiSelect.value ? 'Select LoRAs' : 'Select Checkpoint')
})
const canConfirm = computed(() => {
  return isMultiSelect.value ? selectedModels.value.length > 0 : !!selectedModel.value
})

// Handle Escape key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (modalState.isOpen.value && e.key === 'Escape') {
    closeManager(null)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

watch(
  () => modalState.isOpen.value,
  (isOpen) => {
    if (isOpen) {
      selectedModel.value = undefined
      selectedModels.value = []
    }
  }
)

const onBackdropClick = () => {
  closeManager(null)
}

const handleSelectModel = (model: Model) => {
  selectedModel.value = model

  if (!isMultiSelect.value) {
    selectedModels.value = [model]
    return
  }

  const exists = selectedModels.value.find((item) => item.sha256 === model.sha256)
  if (exists) {
    selectedModels.value = selectedModels.value.filter((item) => item.sha256 !== model.sha256)
  } else {
    selectedModels.value = [...selectedModels.value, model]
  }
}

const confirmSelection = () => {
  if (!canConfirm.value) return

  if (isMultiSelect.value) {
    const doc: LoRAListDocument = {
      version: 2,
      loras: selectedModels.value.map((model) => ({
        name: model.name || model.path,
        full_path: model.path,
        strength_model: 1.0,
        strength_clip: 1.0,
        sha256: model.sha256,
        enabled: true
      }))
    }
    closeManager(doc)
  } else if (selectedModel.value) {
    closeManager({ ckpt_path: selectedModel.value.path })
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modalState.isOpen" class="hikaze-modal-backdrop" @click.self="onBackdropClick">
      <div class="hikaze-modal-content">
        <div class="hikaze-modal-toolbar">
          <div class="modal-title">{{ modalTitle }}</div>
          <div class="modal-actions">
            <div v-if="isMultiSelect" class="selection-count">
              {{ selectedModels.length }} selected
            </div>
            <button class="btn btn-secondary" @click="onBackdropClick">Cancel</button>
            <button class="btn btn-primary" :disabled="!canConfirm" @click="confirmSelection">Confirm</button>
          </div>
        </div>

        <div class="hikaze-modal-body">
          <HikazeManagerLayout :embedded="true" :initialTab="modalState.options?.initialTab">
            <template #library="{ activeTab }">
              <ModelLibrary :active-tab="activeTab" @select-model="handleSelectModel" />
            </template>

            <template #details>
              <ModelDetails :model="selectedModel" />
            </template>
          </HikazeManagerLayout>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.hikaze-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hikaze-modal-content {
  width: 90vw;
  height: 90vh;
  background-color: var(--color-bg-primary, #0f1115);
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.hikaze-modal-body {
  flex: 1;
  min-height: 0;
}

.hikaze-modal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #2d333b;
  background: #161b22;
  gap: 12px;
}

.modal-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #c9d1d9;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selection-count {
  font-size: 0.8rem;
  color: #8b949e;
  padding-right: 4px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-primary {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary:hover {
  background: #2a2f36;
}
</style>
