<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useModelCache } from '../cache/models'
import type { PendingModelRecord } from '@shared/types/model_record'
import { getApiBaseSync } from '@shared/util/sniffer_port'

const props = defineProps<{
  modelId?: number
}>()

const pendingCache = useModelCache('pending')

const localModel = ref<PendingModelRecord | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const imageFailed = ref(false)

const hasImage = computed(() => {
  const images = localModel.value?.meta_json?.images
  return Array.isArray(images) && images.length > 0
})

const imageUrl = computed(() => {
  if (!props.modelId || !hasImage.value) return ''
  const base = getApiBaseSync()
  const prefix = base ? `${base}` : ''
  return `${prefix}/api/images/pending/${props.modelId}`
})

const loadDetails = async (id: number, force = false) => {
  isLoading.value = true
  errorMessage.value = null
  try {
    await pendingCache.loadDetails(String(id), force)
    const cached = pendingCache.getDetails(String(id)).value
    localModel.value = cached ? JSON.parse(JSON.stringify(cached)) : null
  } catch (e: any) {
    errorMessage.value = e?.message || 'Failed to load pending model details'
    localModel.value = null
  } finally {
    isLoading.value = false
  }
}

watch(() => props.modelId, (newVal) => {
  if (typeof newVal === 'number' && !Number.isNaN(newVal)) {
    loadDetails(newVal)
  } else {
    localModel.value = null
  }
  imageFailed.value = false
}, { immediate: true })

watch(hasImage, () => {
  imageFailed.value = false
})
</script>

<template>
  <div class="model-details" v-if="localModel">
    <div class="gallery-wrapper">
      <div class="pending-image-frame">
        <img
          v-if="imageUrl && !imageFailed"
          :src="imageUrl"
          alt="Pending model preview"
          @error="imageFailed = true"
        />
        <div v-else class="pending-image-empty">No Image</div>
      </div>
    </div>

    <div class="details-body">
      <div class="field-group">
        <label>Display Name</label>
        <input type="text" :value="localModel.name" disabled />
      </div>

      <div class="field-group">
        <label>Physical Path</label>
        <div class="readonly-box" :title="localModel.path">{{ localModel.path }}</div>
      </div>

      <div class="field-group">
        <label>SHA256 Hash</label>
        <input type="text" :value="localModel.sha256" disabled class="hash-input" />
      </div>

      <div class="field-group">
        <label>Model Type</label>
        <div class="readonly-box">{{ localModel.type }}</div>
      </div>

      <div class="field-group">
        <label>Tags</label>
        <div class="tag-list">
          <span v-for="tag in localModel.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
        </div>
      </div>

      <div class="field-group">
        <label>Description</label>
        <textarea :value="localModel.meta_json.description" disabled rows="3"></textarea>
      </div>

      <div class="field-group">
        <label>Community Links</label>
        <textarea :value="localModel.meta_json.community_links" disabled rows="2"></textarea>
      </div>

      <div class="field-group">
        <label>Positive Prompt</label>
        <textarea :value="localModel.meta_json.prompts.positive" disabled rows="3"></textarea>
      </div>
      <div class="field-group">
        <label>Negative Prompt</label>
        <textarea :value="localModel.meta_json.prompts.negative" disabled rows="3"></textarea>
      </div>
    </div>
  </div>

  <div v-else class="empty-details">
    <div v-if="isLoading" class="loading-state">Loading details...</div>
    <div v-else-if="errorMessage" class="loading-state">{{ errorMessage }}</div>
    <div v-else>
      <div class="placeholder-icon">📭</div>
      <p>Select a pending model to view details.</p>
    </div>
  </div>
</template>

<style scoped>
.model-details {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #0d1117;
  color: #c9d1d9;
}

.empty-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #484f58;
  text-align: center;
  padding: 20px;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-state {
  color: #8b949e;
}

.gallery-wrapper {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.pending-image-frame {
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
  background: #11161c;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 3 / 4;
}

.pending-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.pending-image-empty {
  color: #8b949e;
  font-size: 0.85rem;
}

.details-body {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
  overflow: visible;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-group input,
.field-group textarea {
  padding: 8px 12px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #0f141a;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 0.9rem;
}

.readonly-box {
  padding: 8px 12px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #8b949e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hash-input {
  font-family: monospace;
  opacity: 0.7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.75rem;
}
</style>
