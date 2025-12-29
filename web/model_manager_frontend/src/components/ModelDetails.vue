<script setup lang="ts">
import { ref, watch } from 'vue'
import HikazeImageGallery from './HikazeImageGallery.vue'
import HikazeTagInput from './HikazeTagInput.vue'
import { 
  fetchModelDetails, 
  addTags, 
  updateModel 
} from '../api/models'
import type { Model, ModelFull } from '../api/models'

const props = defineProps<{
  model?: Model
}>()

const emit = defineEmits(['update-list'])

const localModel = ref<ModelFull | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)

// We parse meta_json to get extended fields
const description = ref('')
const communityLinks = ref('')
const positivePrompt = ref('')
const negativePrompt = ref('')

const loadFullDetails = async (sha256: string) => {
  isLoading.value = true
  try {
    const data = await fetchModelDetails(sha256)
    localModel.value = data
    
    // Parse meta_json for extended fields
    if (data.meta_json) {
      try {
        const meta = JSON.parse(data.meta_json)
        description.value = meta.description || ''
        communityLinks.value = meta.community_links || ''
        positivePrompt.value = meta.prompts?.positive || ''
        negativePrompt.value = meta.prompts?.negative || ''
      } catch (e) {
        console.warn('Failed to parse meta_json', e)
      }
    } else {
      description.value = ''
      communityLinks.value = ''
      positivePrompt.value = ''
      negativePrompt.value = ''
    }
  } catch (e) {
    console.error('Failed to load model details', e)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.model, (newVal) => {
  if (newVal?.sha256) {
    loadFullDetails(newVal.sha256)
  } else {
    localModel.value = null
  }
}, { immediate: true })

const handleSave = async () => {
  if (!localModel.value || !localModel.value.sha256) return
  isSaving.value = true
  
  try {
    const sha256 = localModel.value.sha256
    
    // 1. Resolve Tags (New tags have id -1)
    const tagsToResolve = localModel.value.tags
    const newTagNames = tagsToResolve.filter(t => t.id === -1).map(t => t.name)
    const existingTagIds = tagsToResolve.filter(t => t.id !== -1).map(t => t.id)
    
    let resolvedTagIds = [...existingTagIds]
    
    if (newTagNames.length > 0) {
      const createdTags = await addTags(newTagNames)
      resolvedTagIds = [...resolvedTagIds, ...createdTags.map(t => t.id)]
    }
    
    // 2. Prepare meta_json
    let meta: any = {}
    if (localModel.value.meta_json) {
      try {
        meta = JSON.parse(localModel.value.meta_json)
      } catch {}
    }
    meta.description = description.value
    meta.community_links = communityLinks.value
    meta.prompts = {
      positive: positivePrompt.value,
      negative: negativePrompt.value
    }
    // Clean up removed fields if they exist in legacy data
    delete meta.trigger_words
    delete meta.notes
    
    // 3. Update Model
    // We pass tags as number[] to a specialized update object to satisfy the backend expectation
    // while casting to satisfy TS Partial<ModelFull> intersection
    const updatePayload: any = {
      name: localModel.value.name,
      type: localModel.value.type,
      tags: resolvedTagIds, // This is expected by backend as number[]
      meta_json: JSON.stringify(meta)
    }

    const updated = await updateModel(sha256, updatePayload)
    
    // Refresh local state
    localModel.value = updated
    emit('update-list') // Notify parent to refresh library view
    alert('Saved successfully!')
  } catch (e) {
    alert(`Save failed: ${e}`)
  } finally {
    isSaving.value = false
  }
}

const handleRevert = () => {
  if (props.model?.sha256) {
    loadFullDetails(props.model.sha256)
  }
}

const openLink = () => {
  if (communityLinks.value) {
    window.open(communityLinks.value, '_blank')
  }
}



</script>

<template>
  <div class="model-details" v-if="localModel">
    <!-- Gallery Component -->
    <div class="gallery-wrapper">
      <HikazeImageGallery 
        :sha256="localModel.sha256" 
        @update="emit('update-list')"
      />
    </div>
    
    <div class="details-body">
      <!-- Name (Editable Alias) -->
      <div class="field-group">
        <label>Display Name</label>
        <input type="text" v-model="localModel.name" placeholder="Database alias..." />
      </div>

      <!-- Filename (Read-only) -->
      <div class="field-group">
        <label>Physical Path</label>
        <div class="readonly-box" :title="localModel.path">{{ localModel.path }}</div>
      </div>

      <!-- SHA256 -->
      <div class="field-group">
        <label>SHA256 Hash</label>
        <input type="text" :value="localModel.sha256" disabled class="hash-input" />
      </div>

      <!-- Model Type (Read-only) -->
      <div class="field-group">
        <label>Model Type</label>
        <div class="readonly-box">{{ localModel.type }}</div>
      </div>

      <!-- Tags Component -->
      <div class="field-group">
        <label>Tags</label>
        <HikazeTagInput v-model="localModel.tags" />
      </div>

      <!-- Description -->
      <div class="field-group">
        <label>Description</label>
        <textarea 
          v-model="description" 
          placeholder="Model description..." 
          rows="3"
          class="resize-vertical"
        ></textarea>
      </div>

      <!-- Community Links -->
      <div class="field-group">
        <label>Community Links</label>
        <div class="link-group">
          <input 
            type="text" 
            v-model="communityLinks" 
            placeholder="Link to Civitai, HuggingFace, etc..." 
            class="link-input"
          />
          <button class="btn-visit" @click="openLink" title="Visit Link">🔗</button>
        </div>
      </div>

      <!-- Prompts -->
      <div class="field-group">
        <label>Positive Prompt</label>
        <textarea 
          v-model="positivePrompt" 
          placeholder="Recommended positive prompt..." 
          rows="3"
          class="resize-vertical"
        ></textarea>
      </div>
      <div class="field-group">
        <label>Negative Prompt</label>
        <textarea 
          v-model="negativePrompt" 
          placeholder="Recommended negative prompt..." 
          rows="3"
          class="resize-vertical"
        ></textarea>
      </div>

      <div class="actions">
        <button class="btn primary" @click="handleSave" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button class="btn secondary" @click="handleRevert" :disabled="isSaving">Revert</button>
      </div>
    </div>
  </div>
  
  <div v-else class="empty-details">
    <div v-if="isLoading" class="loading-state">Loading details...</div>
    <div v-else>
      <div class="placeholder-icon">📭</div>
      <p>Select a model from the library to view and edit details.</p>
    </div>
  </div>
</template>

<style scoped>
.model-details {
  height: 100%;
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

.gallery-wrapper {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.details-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}

/* Custom Scrollbar */
.details-body::-webkit-scrollbar {
  width: 4px;
}
.details-body::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;
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
.field-group select,
.field-group textarea {
  padding: 8px 12px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #0f141a;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
  outline: none;
  border-color: #1f6feb;
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

.hash-row {
  display: flex;
  gap: 8px;
}

.hash-input {
  flex: 1;
  font-family: monospace !important;
  opacity: 0.7;
}

.btn-calc {
  padding: 0 12px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  cursor: pointer;
}

.resize-vertical {
  resize: vertical;
  min-height: 38px; /* Approx one line + padding */
}

.link-group {
  display: flex;
  gap: 8px;
}

.link-input {
  flex: 1;
  text-overflow: ellipsis; /* Truncate if too long */
}

.btn-visit {
  padding: 0 12px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.btn-visit:hover {
  background: #30363d;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #2d333b;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn.primary {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}
.btn.primary:hover { background: #2ea043; }
.btn.primary:disabled { background: #238636; opacity: 0.5; cursor: not-allowed; }

.btn.secondary:hover { background: #30363d; }
</style>
