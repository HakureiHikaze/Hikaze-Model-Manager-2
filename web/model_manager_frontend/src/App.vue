<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HikazeManagerLayout from './components/HikazeManagerLayout.vue'
import FloatingToolbar from './components/FloatingToolbar.vue'
import ModelLibrary from './components/ModelLibrary.vue'
import ModelDetails from './components/ModelDetails.vue'
import PendingModelLibrary from './components/PendingModelLibrary.vue'
import PendingModelDetails from './components/PendingModelDetails.vue'
import { useModelCache } from './cache/models'
import { importModels } from './api/models'
import type { Model, PendingModelSimpleRecord } from '@shared/types/model_record'

const isEmbedded = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('embedded') === 'true'
})

const initialTab = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('initialTab') || undefined
})

const selectedModel = ref<Model | undefined>(undefined)
const selectedPendingModel = ref<PendingModelSimpleRecord | undefined>(undefined)
const selectedPendingIds = ref<number[]>([])
const managerMode = ref<'active' | 'pending'>('active')
const isImporting = ref(false)

const activeCache = useModelCache()
const pendingCache = useModelCache('pending')
const pendingModels = pendingCache.getModels('pending')
const pendingCount = computed(() => pendingModels.value.length)
const hasPendingBadge = computed(() => pendingCount.value > 0)

const isPendingMode = computed(() => managerMode.value === 'pending')

const handleSelectModel = (model: Model) => {
  selectedModel.value = model
}

const handleSelectPendingModel = (model: PendingModelSimpleRecord) => {
  selectedPendingModel.value = model
}

const handleTogglePending = (model: PendingModelSimpleRecord, nextSelected: boolean) => {
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
  selectedPendingModel.value = undefined
  selectedPendingIds.value = []
  await pendingCache.loadModels('pending', true)
}

const exitPendingMode = () => {
  managerMode.value = 'active'
  selectedPendingModel.value = undefined
  selectedPendingIds.value = []
}

const togglePendingMode = () => {
  if (isPendingMode.value) {
    exitPendingMode()
  } else {
    enterPendingMode()
  }
}

const refreshPending = async () => {
  await pendingCache.loadModels('pending', true)
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
  if (selectedPendingIds.value.length === 0 || isImporting.value) return
  isImporting.value = true
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
    await refreshPending()
    activeCache.invalidate()
  } catch (e: any) {
    window.alert(e?.message || 'Failed to import pending models')
  } finally {
    isImporting.value = false
  }
}

onMounted(() => {
  pendingCache.loadModels('pending')
})
</script>

<template>
  <HikazeManagerLayout :embedded="isEmbedded" :initialTab="initialTab" :mode="managerMode">
    <template #library="{ activeTab }">
      <template v-if="isPendingMode">
        <PendingModelLibrary
          :active-tab="activeTab"
          :selected-ids="selectedPendingIds"
          @select-model="handleSelectPendingModel"
          @toggle-select="handleTogglePending"
        />
      </template>
      <template v-else>
        <ModelLibrary
          :active-tab="activeTab"
          @select-model="handleSelectModel"
        />
      </template>
    </template>

    <template #details>
      <template v-if="isPendingMode">
        <PendingModelDetails :model-id="selectedPendingModel?.id" />
      </template>
      <template v-else>
        <ModelDetails 
          :model="selectedModel" 
          @update-list="() => { /* Trigger list refresh if needed */ }"
        />
      </template>
    </template>

    <template #toolbar="{ activeTab }">
      <FloatingToolbar v-if="!isEmbedded" :active-tab="activeTab">
        <button
          class="toolbar-btn"
          :class="{ active: isPendingMode }"
          type="button"
          @click="togglePendingMode"
        >
          Pending
          <span v-if="hasPendingBadge" class="badge">{{ pendingCount }}</span>
        </button>
        <button
          v-if="isPendingMode"
          class="toolbar-btn pending-import"
          type="button"
          :disabled="selectedPendingIds.length === 0 || isImporting"
          @click="runPendingImport"
        >
          Import Selected
        </button>
      </FloatingToolbar>
    </template>
  </HikazeManagerLayout>
</template>

<style>
.toolbar-btn {
  position: relative;
  appearance: none;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 6px 10px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.85rem;
  cursor: pointer;
}

.toolbar-btn.active {
  background: var(--hikaze-accent, #d29922);
  border-color: var(--hikaze-accent-border, #b0881b);
  color: #fff;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.pending-import {
  background: rgba(210, 153, 34, 0.2);
  border-color: rgba(210, 153, 34, 0.6);
  color: #f0f6fc;
}
</style>
