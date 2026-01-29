<script setup lang="ts">
import { Teleport, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { modalState, closeManager } from '../injection/modalService'
import HikazeManagerLayout from '@manager/components/HikazeManagerLayout.vue'
import ModelLibrary from '@manager/components/ModelLibrary.vue'
import ModelDetails from '@manager/components/ModelDetails.vue'
import SelectedLoraBar from '@manager/components/SelectedLoraBar.vue'
import PendingModelLibrary from '@manager/components/PendingModelLibrary.vue'
import PendingModelDetails from '@manager/components/PendingModelDetails.vue'
import { useModelCache } from '@manager/cache/models'
import { importModels } from '@manager/api/models'
import type { Model, PendingModelSimpleRecord, Tag } from '@shared/types/model_record'
import { adaptLoRAEntry, createEmptyLoRAListDocument, parseLoRAListJson } from '@shared/adapters/loras'
import type { LoRAEntry, LoRAListDocument } from '@shared/types/lora_list'

type SelectedLoraItem = {
  sha256: string
  name: string
  path: string
  tags: Tag[]
}

const selectedModel = ref<Model | undefined>(undefined)
const selectedModels = ref<Model[]>([])
const isFullscreen = ref(false)
const selectedLoraIds = ref<string[]>([])
const selectedLoraItems = ref<Record<string, SelectedLoraItem>>({})
const originalLoraBySha = ref<Record<string, LoRAEntry>>({})
const loraVersion = ref(2)
const managerMode = ref<'active' | 'pending'>('active')
const selectedPendingIds = ref<number[]>([])
const selectedPendingModel = ref<PendingModelSimpleRecord | undefined>(undefined)
const isPendingImporting = ref(false)

const activeCache = useModelCache()
const pendingCache = useModelCache('pending')
const pendingModels = pendingCache.getModels('pending')
const pendingCount = computed(() => pendingModels.value.length)
const hasPendingBadge = computed(() => pendingCount.value > 0)
const isPendingMode = computed(() => managerMode.value === 'pending')

const modalOptions = computed(() => modalState.options)
const isMultiSelect = computed(() => modalOptions.value?.mode === 'multi')
const isLoraSelection = computed(() => {
  const tab = String(modalOptions.value?.initialTab || '').toLowerCase()
  return isMultiSelect.value && (tab === 'loras' || tab === 'lora')
})
const modalTitle = computed(() => {
  return modalOptions.value?.title || (isMultiSelect.value ? 'Select LoRAs' : 'Select Checkpoint')
})
const selectedCount = computed(() => {
  return isLoraSelection.value ? selectedLoraIds.value.length : selectedModels.value.length
})
const canConfirm = computed(() => {
  if (isPendingMode.value) {
    return false
  }
  return isMultiSelect.value ? selectedCount.value > 0 : !!selectedModel.value
})
const fullscreenLabel = computed(() => (isFullscreen.value ? 'Exit fullscreen' : 'Enter fullscreen'))
const selectedLoraList = computed(() => {
  return selectedLoraIds.value
    .map((sha) => selectedLoraItems.value[sha])
    .filter((item): item is SelectedLoraItem => !!item)
})

// Handle Escape key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (modalState.isOpen && e.key === 'Escape') {
    closeManager(null)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const resetLoraState = () => {
  selectedLoraIds.value = []
  selectedLoraItems.value = {}
  originalLoraBySha.value = {}
  loraVersion.value = 2
}

const initLoraSelection = () => {
  resetLoraState()
  if (!isLoraSelection.value) return

  const raw = modalOptions.value?.payloadJson ?? ''
  try {
    const doc = parseLoRAListJson(raw)
    loraVersion.value = Number(doc.version) || 2

    const nextItems: Record<string, SelectedLoraItem> = {}
    const nextOriginal: Record<string, LoRAEntry> = {}
    const nextIds: string[] = []

    doc.loras.forEach((entry) => {
      const sha = String(entry.sha256 || '').trim()
      if (!sha || nextOriginal[sha]) return
      nextOriginal[sha] = entry
      nextIds.push(sha)
      nextItems[sha] = {
        sha256: sha,
        name: entry.name || entry.full_path,
        path: entry.full_path,
        tags: []
      }
    })

    selectedLoraIds.value = nextIds
    selectedLoraItems.value = nextItems
    originalLoraBySha.value = nextOriginal
  } catch (e) {
    console.warn('Failed to parse LoRA payload JSON', e)
    const emptyDoc = createEmptyLoRAListDocument()
    loraVersion.value = Number(emptyDoc.version) || 2
  }
}

watch(
  () => modalState.isOpen,
  (isOpen) => {
    if (isOpen) {
      selectedModel.value = undefined
      selectedModels.value = []
      initLoraSelection()
    }
    isFullscreen.value = false
    managerMode.value = 'active'
    selectedPendingIds.value = []
    selectedPendingModel.value = undefined
    pendingCache.loadModels('pending')
  }
)

const onBackdropClick = () => {
  closeManager(null)
}

const addLoraSelection = (sha256: string, item: SelectedLoraItem) => {
  if (!selectedLoraIds.value.includes(sha256)) {
    selectedLoraIds.value = [...selectedLoraIds.value, sha256]
  }
  selectedLoraItems.value = {
    ...selectedLoraItems.value,
    [sha256]: item
  }
}

const removeLoraSelection = (sha256: string) => {
  if (!selectedLoraIds.value.includes(sha256)) return
  selectedLoraIds.value = selectedLoraIds.value.filter((id) => id !== sha256)
  const nextItems = { ...selectedLoraItems.value }
  delete nextItems[sha256]
  selectedLoraItems.value = nextItems
}

const handleToggleSelect = (model: Model, nextSelected: boolean) => {
  if (!isLoraSelection.value || !model.sha256) return
  if (nextSelected) {
    addLoraSelection(model.sha256, {
      sha256: model.sha256,
      name: model.name || model.path,
      path: model.path,
      tags: model.tags
    })
  } else {
    removeLoraSelection(model.sha256)
  }
}

const handleSelectedBarToggle = (sha256: string, nextSelected: boolean) => {
  if (!isLoraSelection.value) return
  if (!nextSelected) {
    removeLoraSelection(sha256)
  }
}

const buildStubModel = (item: SelectedLoraItem): Model => {
  return {
    sha256: item.sha256,
    name: item.name,
    path: item.path,
    tags: item.tags,
    images_count: 0,
    type: 'lora',
    size_bytes: 0,
    created_at: 0
  }
}

const handleSelectedBarSelect = (item: SelectedLoraItem) => {
  selectedModel.value = buildStubModel(item)
}

const clearSelection = () => {
  selectedLoraIds.value = []
  selectedLoraItems.value = {}
}

const handleSelectModel = (model: Model) => {
  if (isPendingMode.value) {
    return
  }
  selectedModel.value = model

  if (isLoraSelection.value) {
    if (model.sha256 && !selectedLoraIds.value.includes(model.sha256)) {
      addLoraSelection(model.sha256, {
        sha256: model.sha256,
        name: model.name || model.path,
        path: model.path,
        tags: model.tags
      })
    }
    return
  }

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

const handleSelectPendingModel = (model: PendingModelSimpleRecord) => {
  selectedPendingModel.value = model
}

const handleTogglePendingModel = (model: PendingModelSimpleRecord, nextSelected: boolean) => {
  if (nextSelected) {
    if (!selectedPendingIds.value.includes(model.id)) {
      selectedPendingIds.value = [...selectedPendingIds.value, model.id]
    }
    return
  }
  selectedPendingIds.value = selectedPendingIds.value.filter((id) => id !== model.id)
}

const enterPendingMode = async () => {
  managerMode.value = 'pending'
  selectedPendingIds.value = []
  selectedPendingModel.value = undefined
  await pendingCache.loadModels('pending', true)
}

const exitPendingMode = () => {
  managerMode.value = 'active'
  selectedPendingIds.value = []
  selectedPendingModel.value = undefined
}

const togglePendingMode = () => {
  if (isPendingMode.value) {
    exitPendingMode()
  } else {
    enterPendingMode()
  }
}

const formatConflictSummary = (
  conflicts: Array<{
    pending?: { id?: number; path?: string }
    existing?: { id?: string; path?: string }
  }>
) => {
  const nameById = new Map(pendingModels.value.map((model) => [model.id, model.name]))
  return conflicts.map((item, index) => {
    const pendingId = item.pending?.id
    const pendingName = pendingId !== undefined ? nameById.get(pendingId) : undefined
    const pendingLabel = pendingName
      ? `${pendingName} (#${pendingId})`
      : `#${pendingId ?? 'unknown'}`
    const pendingPath = item.pending?.path ? ` | ${item.pending.path}` : ''
    const existingLabel = item.existing?.id ?? 'unknown'
    const existingPath = item.existing?.path ? ` | ${item.existing.path}` : ''
    return `${index + 1}. Pending: ${pendingLabel}${pendingPath}\n   Existing: ${existingLabel}${existingPath}`
  }).join('\n')
}

const runPendingImport = async () => {
  if (selectedPendingIds.value.length === 0 || isPendingImporting.value) return
  isPendingImporting.value = true
  try {
    const result = await importModels(selectedPendingIds.value, null)
    if (result.conflict.length > 0) {
      window.alert(`Conflicts detected:\n${formatConflictSummary(result.conflict)}`)
      const allowed = ['override', 'merge', 'ignore', 'delete'] as const
      type ConflictStrategy = (typeof allowed)[number]
      const isConflictStrategy = (value: string): value is ConflictStrategy =>
        allowed.includes(value as ConflictStrategy)

      let followupStrategy: ConflictStrategy | null = null
      let conflictIds: number[] = []
      const choice = window.prompt(
        'Conflicts found. Choose strategy: override, merge, ignore, delete',
        'override'
      )
      if (choice) {
        const normalized = choice.trim().toLowerCase()
        if (!isConflictStrategy(normalized)) {
          window.alert('Invalid strategy. Please use override, merge, ignore, or delete.')
        } else {
          followupStrategy = normalized
          conflictIds = result.conflict
            .map((item) => item.pending?.id)
            .filter((id): id is number => typeof id === 'number')
        }
      }
      if (followupStrategy && conflictIds.length > 0) {
        await importModels(conflictIds, followupStrategy)
      }
    }
    selectedPendingIds.value = []
    selectedPendingModel.value = undefined
    await pendingCache.loadModels('pending', true)
    activeCache.invalidate()
  } catch (e: any) {
    window.alert(e?.message || 'Failed to import pending models')
  } finally {
    isPendingImporting.value = false
  }
}

const confirmSelection = () => {
  if (!canConfirm.value) return

  if (isMultiSelect.value) {
    if (isLoraSelection.value) {
      const loras = selectedLoraIds.value.map((sha) => {
        const original = originalLoraBySha.value[sha]
        if (original) return original
        const item = selectedLoraItems.value[sha]
        return adaptLoRAEntry({
          name: item?.name ?? '',
          full_path: item?.path ?? '',
          strength_model: 1.0,
          strength_clip: 1.0,
          sha256: sha,
          enabled: true
        })
      })
      const doc: LoRAListDocument = {
        version: Number(loraVersion.value) || 2,
        loras
      }
      closeManager(doc)
      return
    }
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

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modalState.isOpen"
      class="hikaze-modal-backdrop"
      :class="{ 'is-fullscreen': isFullscreen }"
      @click.self="onBackdropClick"
    >
      <div class="hikaze-modal-content" :class="{ 'is-fullscreen': isFullscreen, 'is-pending': isPendingMode }">
        <div class="hikaze-modal-toolbar">
          <div class="modal-title">{{ modalTitle }}</div>
          <div class="modal-actions">
            <div v-if="isMultiSelect && !isPendingMode" class="selection-count">
              {{ selectedCount }} selected
            </div>
            <button
              class="btn btn-secondary pending-toggle"
              type="button"
              :class="{ active: isPendingMode }"
              @click="togglePendingMode"
            >
              Pending
              <span v-if="hasPendingBadge" class="badge">{{ pendingCount }}</span>
            </button>
            <button
              v-if="isPendingMode"
              class="btn btn-secondary pending-import"
              type="button"
              :disabled="selectedPendingIds.length === 0 || isPendingImporting"
              @click="runPendingImport"
            >
              Import Selected
            </button>
            <button
              v-if="isLoraSelection && !isPendingMode"
              class="btn btn-secondary"
              type="button"
              :disabled="selectedCount === 0"
              @click="clearSelection"
            >
              Clear selection
            </button>
            <button
              class="btn btn-secondary btn-icon"
              type="button"
              :aria-label="fullscreenLabel"
              :title="fullscreenLabel"
              @click="toggleFullscreen"
            >
              &#x1F5D7;
            </button>
            <button class="btn btn-secondary" @click="onBackdropClick">Cancel</button>
            <button class="btn btn-primary" :disabled="!canConfirm" @click="confirmSelection">Confirm</button>
          </div>
        </div>

        <div class="hikaze-modal-body">
          <HikazeManagerLayout :embedded="true" :initialTab="modalState.options?.initialTab" :mode="managerMode">
            <template #library="{ activeTab }">
              <div class="lora-library-pane">
                <SelectedLoraBar
                  v-if="isLoraSelection && !isPendingMode"
                  :items="selectedLoraList"
                  @toggle="handleSelectedBarToggle"
                  @select="handleSelectedBarSelect"
                />
                <div class="lora-library-body">
                  <PendingModelLibrary
                    v-if="isPendingMode"
                    :active-tab="activeTab"
                    :selected-ids="selectedPendingIds"
                    @select-model="handleSelectPendingModel"
                    @toggle-select="handleTogglePendingModel"
                  />
                  <ModelLibrary
                    v-else
                    :active-tab="activeTab"
                    :selection-mode="isLoraSelection ? 'lora' : undefined"
                    :selected-ids="selectedLoraIds"
                    :exclude-selected="isLoraSelection"
                    @select-model="handleSelectModel"
                    @toggle-select="handleToggleSelect"
                  />
                </div>
              </div>
            </template>

            <template #details>
              <PendingModelDetails v-if="isPendingMode" :model-id="selectedPendingModel?.id" />
              <ModelDetails v-else :model="selectedModel" />
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

.hikaze-modal-backdrop.is-fullscreen {
  align-items: stretch;
  justify-content: stretch;
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

.hikaze-modal-content.is-fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.hikaze-modal-body {
  flex: 1;
  min-height: 0;
}

.lora-library-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.lora-library-body {
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

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
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

.hikaze-modal-content.is-pending .btn-primary {
  background: #d29922;
  border-color: #b0881b;
}

.pending-toggle {
  position: relative;
}

.pending-toggle.active {
  background: #d29922;
  border-color: #b0881b;
  color: #fff;
}

.pending-import {
  background: rgba(210, 153, 34, 0.2);
  border-color: rgba(210, 153, 34, 0.6);
  color: #f0f6fc;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #f85149;
  color: #fff;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 0.7rem;
  line-height: 18px;
  height: 18px;
  min-width: 18px;
  text-align: center;
}
</style>
