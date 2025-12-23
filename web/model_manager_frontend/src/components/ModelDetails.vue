<script setup lang="ts">
import { ref, watch } from 'vue'

interface ModelData {
  sha256?: string
  path: string
  name: string
  type: string
  base?: string
  tags: string[]
  triggerWords: string[]
  notes: string
  image?: string
  isPending?: boolean
}

const props = defineProps<{
  model?: ModelData
}>()

const localModel = ref<ModelData>({
  path: '',
  name: '',
  type: '',
  tags: [],
  triggerWords: [],
  notes: '',
})

// Update local state when prop changes
watch(() => props.model, (newVal) => {
  if (newVal) {
    localModel.value = { ...newVal }
  }
}, { immediate: true })

const tagInput = ref('')
const triggerInput = ref('')
const isHoveringImage = ref(false)

const addChip = (type: 'tags' | 'triggerWords', value: string) => {
  const val = value.trim().replace(/,$/, '')
  if (val && !localModel.value[type].includes(val)) {
    localModel.value[type].push(val)
  }
}

const handleTagInput = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === ',') {
    e.preventDefault()
    addChip('tags', tagInput.value)
    tagInput.value = ''
  }
}

const handleTriggerInput = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === ',') {
    e.preventDefault()
    addChip('triggerWords', triggerInput.value)
    triggerInput.value = ''
  }
}

const removeChip = (type: 'tags' | 'triggerWords', index: number) => {
  localModel.value[type].splice(index, 1)
}

const calculateSHA256 = () => {
  console.log('Requesting SHA256 calculation for:', localModel.value.path)
  // Placeholder for API call
  alert('SHA256 calculation started in background...')
}

const uploadImage = () => {
  console.log('Upload image triggered')
}
</script>

<template>
  <div class="model-details" v-if="localModel.path">
    <!-- Image Preview Area -->
    <div 
      class="preview-area" 
      @mouseenter="isHoveringImage = true" 
      @mouseleave="isHoveringImage = false"
    >
      <img v-if="localModel.image" :src="localModel.image" class="preview-img" />
      <div v-else class="no-image">No Preview</div>
      
      <div class="image-overlay" v-show="isHoveringImage">
        <button v-if="localModel.image" class="overlay-btn" title="Open in new tab">
          <span class="icon">🔗</span>
        </button>
        <button class="overlay-btn" @click="uploadImage" title="Upload new image">
          <span class="icon">📁</span>
        </button>
      </div>
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
        <div class="hash-row">
          <input type="text" :value="localModel.sha256 || 'Unknown'" disabled class="hash-input" />
          <button class="btn-calc" @click="calculateSHA256" title="Calculate Hash">
            ⚡
          </button>
        </div>
      </div>

      <!-- Base Model -->
      <div class="field-group">
        <label>Base Model</label>
        <select v-model="localModel.base">
          <option value="SD1.5">SD 1.5</option>
          <option value="SD2.1">SD 2.1</option>
          <option value="SDXL">SDXL</option>
          <option value="SD3">SD3</option>
          <option value="Pony">Pony</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- Tags (Chips) -->
      <div class="field-group">
        <label>Tags</label>
        <div class="chips-container">
          <div v-for="(tag, i) in localModel.tags" :key="tag" class="chip">
            {{ tag }}
            <button class="chip-remove" @click="removeChip('tags', i)">×</button>
          </div>
          <input 
            type="text" 
            v-model="tagInput" 
            @keydown="handleTagInput"
            placeholder="Add tag..."
            class="chip-input"
          />
        </div>
      </div>

      <!-- Trigger Words (Chips) -->
      <div class="field-group" v-if="localModel.type === 'LoRA' || localModel.type === 'Checkpoint'">
        <label>Trigger Words</label>
        <div class="chips-container">
          <div v-for="(word, i) in localModel.triggerWords" :key="word" class="chip trigger">
            {{ word }}
            <button class="chip-remove" @click="removeChip('triggerWords', i)">×</button>
          </div>
          <input 
            type="text" 
            v-model="triggerInput" 
            @keydown="handleTriggerInput"
            placeholder="Add trigger word..."
            class="chip-input"
          />
        </div>
      </div>

      <!-- Notes -->
      <div class="field-group">
        <label>Notes</label>
        <textarea v-model="localModel.notes" placeholder="Additional details..."></textarea>
      </div>

      <div class="actions">
        <button class="btn primary">Save Changes</button>
        <button class="btn secondary">Revert</button>
      </div>
    </div>
  </div>
  
  <div v-else class="empty-details">
    <div class="placeholder-icon">📭</div>
    <p>Select a model from the library to view and edit details.</p>
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

.preview-area {
  width: 100%;
  aspect-ratio: 3/4;
  background: #151b23;
  border: 1px solid #30363d;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.overlay-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.overlay-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}

.details-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}

/* Custom Scrollbar for Details Body */
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

.btn-calc:hover {
  background: #30363d;
  color: #f0f6fc;
}

/* Chips Container */
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  background: #0f141a;
  border: 1px solid #30363d;
  border-radius: 6px;
  min-height: 38px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #238636; /* Success/Green for tags */
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  position: relative;
}

.chip.trigger {
  background: #1f6feb; /* Blue for trigger words */
}

.chip-remove {
  background: none;
  border: none;
  color: white;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: all 0.2s;
  line-height: 1;
}

.chip:hover .chip-remove {
  opacity: 1;
  width: 14px;
  margin-left: 4px;
}

.chip-input {
  border: none !important;
  background: transparent !important;
  padding: 2px 4px !important;
  flex: 1;
  min-width: 80px;
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

.btn.primary:hover {
  background: #2ea043;
}

.btn.secondary:hover {
  background: #30363d;
}
</style>
