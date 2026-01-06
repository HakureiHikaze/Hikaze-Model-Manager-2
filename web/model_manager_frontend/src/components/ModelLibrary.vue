<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, reactive } from 'vue'
import { useModelCache } from '../cache/models'
import { useTagsCache } from '../cache/tags'
import { useImageCache } from '../cache/images'
import { useIntersectionObserver } from '../util/intersectionObserver'
import type { Model, Tag } from '@shared/types/model_record'

const props = defineProps<{
  activeTab: string
  selectionMode?: 'lora'
  selectedIds?: string[]
  excludeSelected?: boolean
}>()
const emit = defineEmits(['select-model', 'toggle-select'])

const modelCache = useModelCache()
const tagsCache = useTagsCache()
const imageCache = useImageCache()

const viewMode = ref<'card' | 'list'>('card')
const columnCount = ref(4)
const hoveredId = ref<string | null>(null)
const tooltipPlacement = ref<'top' | 'bottom'>('bottom')
const showTagFilter = ref(false)

const searchQuery = ref('')
const tagFilters = ref<Map<number, 'include' | 'exclude'>>(new Map())
const selectionActive = computed(() => props.selectionMode === 'lora')
const selectedSet = computed(() => new Set(props.selectedIds ?? []))

const rawModels = modelCache.getModels(computed(() => props.activeTab))
const isLoading = modelCache.isLoading(computed(() => props.activeTab))
const error = modelCache.getError(computed(() => props.activeTab))

// Preview cycling state
const previewState = reactive<Record<string, { current: number }>>({})
const previewIntervals = new Map<string, number>()

// Lazy loading logic
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) observer.disconnect()
  
  observer = useIntersectionObserver((entry) => {
    const target = entry.target as HTMLElement
    const sha256 = target.dataset.sha256
    if (!sha256) return

    // Just check for the first image to determine "loaded" or "error"
    // The actual background image is now bound via :style in template
    const img = new Image()
    const url = imageCache.getImageUrl(sha256, 0, 'medium')
    
    img.onload = () => {
      target.classList.remove('lazy')
      target.classList.add('loaded')
    }
    
    img.onerror = () => {
      target.classList.remove('lazy')
      target.classList.add('error')
    }
    
    img.src = url
    observer?.unobserve(target)
  })

  nextTick(() => {
    const elements = document.querySelectorAll('.card-image.lazy')
    elements.forEach(el => observer?.observe(el))
  })
}

// Preview Cycling Logic
const startCycling = async (sha256: string) => {
  await imageCache.loadImageCount(sha256)
  const count = imageCache.getImageCount(sha256).value
  if (count <= 1) return

  if (!previewState[sha256]) {
    previewState[sha256] = { current: 0 }
  }

  const existing = previewIntervals.get(sha256)
  if (existing) clearInterval(existing)

  const interval = window.setInterval(() => {
    const state = previewState[sha256]
    if (!state) return
    state.current = (state.current + 1) % count
  }, 1000)

  previewIntervals.set(sha256, interval)
}

const stopCycling = (sha256: string) => {
  const interval = previewIntervals.get(sha256)
  if (interval) {
    clearInterval(interval)
    previewIntervals.delete(sha256)
  }

  if (previewState[sha256]) {
    previewState[sha256].current = 0
  }
}

const getPreviewStyle = (sha256: string) => {
  const state = previewState[sha256]
  const seq = state ? state.current : 0
  return {
    backgroundImage: `url(${imageCache.getImageUrl(sha256, seq, 'medium')})`
  }
}

const onMouseEnter = (e: MouseEvent, id: string) => {
  hoveredId.value = id
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  tooltipPlacement.value = spaceBelow < 250 ? 'top' : 'bottom'
  
  startCycling(id)
}

const onMouseLeave = (id: string) => {
  hoveredId.value = null
  stopCycling(id)
}

const emitToggleSelect = (model: Model, nextSelected: boolean) => {
  emit('toggle-select', model, nextSelected)
}

const selectModel = (model: Model) => {
  emit('select-model', model)
  if (selectionActive.value && model.sha256 && !selectedSet.value.has(model.sha256)) {
    emitToggleSelect(model, true)
  }
}

const toggleSelection = (model: Model, event: Event) => {
  const target = event.target as HTMLInputElement
  if (!model.sha256) return
  emitToggleSelect(model, target.checked)
}

const allTags = tagsCache.getTags()

onMounted(async () => {
  if (viewMode.value === 'card') {
    setupObserver()
  }

  // Auto-exclude NSFW
  try {
    await tagsCache.loadTags()
    const nsfwTag = allTags.value.find(t => t.name.toLowerCase() === 'nsfw')
    if (nsfwTag) {
      tagFilters.value.set(nsfwTag.id, 'exclude')
    }
  } catch (e) {
    console.error('Failed to load tags for auto-exclude:', e)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  previewIntervals.forEach((interval) => clearInterval(interval))
  previewIntervals.clear()
})

const filteredModels = computed(() => {
  let result = rawModels.value as Model[]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((m: Model) => 
      m.name.toLowerCase().includes(q) || 
      m.path.toLowerCase().includes(q)
    )
  }

  // Apply tag filter (AND logic for includes, NOT logic for excludes)
  if (tagFilters.value.size > 0) {
    const includedIds = Array.from(tagFilters.value.entries())
      .filter(([_, state]) => state === 'include')
      .map(([id]) => id)
      
    const excludedIds = Array.from(tagFilters.value.entries())
      .filter(([_, state]) => state === 'exclude')
      .map(([id]) => id)

    result = result.filter((m: Model) => {
      const modelTagIds = new Set(m.tags.map((t: Tag) => t.id))
      
      // Must have ALL included tags
      const hasAllIncluded = includedIds.every(id => modelTagIds.has(id))
      
      // Must have NO excluded tags
      const hasNoExcluded = !excludedIds.some(id => modelTagIds.has(id))
      
      return hasAllIncluded && hasNoExcluded
    })
  }

  if (props.excludeSelected && selectedSet.value.size > 0) {
    result = result.filter((m: Model) => !selectedSet.value.has(m.sha256))
  }

  return result
})

// Extract unique tags for the filter dropdown, keep selected tags on top.
const availableTags = computed(() => {
  const tagCounts = new Map<number, number>()
  filteredModels.value.forEach((model: Model) => {
    model.tags.forEach((tag: Tag) => {
      tagCounts.set(tag.id, (tagCounts.get(tag.id) ?? 0) + 1)
    })
  })

  const tagsById = new Map(allTags.value.map((tag) => [tag.id, tag]))
  const selectedTags: Tag[] = []
  tagFilters.value.forEach((_, id) => {
    const tag = tagsById.get(id)
    if (tag) selectedTags.push(tag)
  })

  const unselectedTags = allTags.value
    .filter((tag) => !tagFilters.value.has(tag.id) && (tagCounts.get(tag.id) ?? 0) > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  return [...selectedTags, ...unselectedTags]
})

// Re-setup observer when models or view mode changes
watch([filteredModels, viewMode], () => {
  if (viewMode.value === 'card') {
    setupObserver()
  }
}, { deep: true })

function toggleTag(tagId: number) {
  const currentState = tagFilters.value.get(tagId)
  
  if (currentState === 'include') {
    tagFilters.value.set(tagId, 'exclude')
  } else if (currentState === 'exclude') {
    tagFilters.value.delete(tagId)
  } else {
    tagFilters.value.set(tagId, 'include')
  }
}

function clearTags() {
  tagFilters.value.clear()
}

function refresh() {
  modelCache.reset()
  imageCache.resetImageCache()
  modelCache.loadModels(props.activeTab, true)
}

const setView = (mode: 'card' | 'list') => {
  viewMode.value = mode
}

const gridStyle = computed(() => {
  if (viewMode.value !== 'card') return {}
  return {
    gridTemplateColumns: `repeat(${columnCount.value}, 1fr)`
  }
})
</script>

<template>
  <div class="model-library">
    <div class="library-toolbar">
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search models..." />
      </div>

      <div class="controls-right">
        <div class="column-control" v-if="viewMode === 'card'">
          <label for="col-count">Cols:</label>
          <input id="col-count" type="number" v-model.number="columnCount" min="2" max="10" step="1" />
        </div>

        <div class="view-switch">
          <button :class="{ active: viewMode === 'card' }" @click="setView('card')">Card</button>
          <button :class="{ active: viewMode === 'list' }" @click="setView('list')">List</button>
        </div>

        <button class="btn-refresh" @click="refresh" :disabled="isLoading" title="Refresh model library">
          Refresh
        </button>

        <div class="tag-filter">
          <button class="btn-filter" :class="{ active: tagFilters.size > 0 }" @click="showTagFilter = !showTagFilter">
            Tags Filter {{ tagFilters.size > 0 ? `(${tagFilters.size})` : '' }}
          </button>
          <div v-if="showTagFilter" class="tag-dropdown">
            <div v-if="availableTags.length === 0" class="placeholder-msg">No tags available</div>
            <div v-else class="tag-list">
              <div 
                v-for="tag in availableTags" 
                :key="tag.id" 
                class="tag-item"
                :class="tagFilters.get(tag.id)"
                @click="toggleTag(tag.id)"
              >
                {{ tag.name }}
              </div>
              <div class="tag-dropdown-actions">
                <button @click="clearTags" class="btn-clear">Clear All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="library-content" :class="viewMode" :style="gridStyle">
      <div v-if="isLoading" class="library-loading">
        <span class="spinner"></span> Loading models...
      </div>
      <div v-else-if="error" class="library-error">
        {{ error }}
      </div>
      <template v-else-if="viewMode === 'card'">
          <div 
            v-for="model in filteredModels" 
            :key="model.sha256" 
            class="card-item" 
            :class="{ 'dense-view': columnCount > 6 }"
            @click="selectModel(model)"
            @mouseenter="(e) => onMouseEnter(e, model.sha256)" 
            @mouseleave="onMouseLeave(model.sha256)"
          >
            <label
              v-if="selectionActive"
              class="selection-checkbox"
              @click.stop
            >
              <input
                type="checkbox"
                :checked="selectedSet.has(model.sha256)"
                @click.stop
                @change="(event) => toggleSelection(model, event)"
              />
            </label>
            <div 
              class="card-image lazy" 
              :data-sha256="model.sha256"
              :style="getPreviewStyle(model.sha256)"
            ></div>
          <div class="card-meta">
            <div class="card-title">{{ model.name }}</div>
            <div class="card-tags">
              <span v-for="tag in model.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>

          <!-- Hover Tooltip -->
          <div v-if="hoveredId === model.sha256" class="card-tooltip" :class="tooltipPlacement">
            <div class="tooltip-name">{{ model.name }}</div>
            <div class="tooltip-tags">
              <span v-for="tag in model.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="list-container">
          <div 
            v-for="model in filteredModels" 
            :key="model.sha256" 
            class="list-item"
            @click="selectModel(model)"
          >
            <label
              v-if="selectionActive"
              class="list-checkbox"
              @click.stop
            >
              <input
                type="checkbox"
                :checked="selectedSet.has(model.sha256)"
                @click.stop
                @change="(event) => toggleSelection(model, event)"
              />
            </label>
            <div class="list-name">{{ model.name }}</div>
            <div class="list-tags">
              <span v-for="tag in model.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* (styles unchanged) */
.model-library {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0f1115;
}

.library-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #2d333b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #161b22;
}

.search-box input {
  padding: 6px 8px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #0d1117;
  color: #c9d1d9;
  min-width: 200px;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.column-control {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #8b949e;
}

.column-control input {
  width: 50px;
  padding: 4px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #0d1117;
  color: #c9d1d9;
  text-align: center;
}

.view-switch {
  display: flex;
  gap: 6px;
}

.view-switch button {
  padding: 4px 8px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.85rem;
}

.view-switch button.active {
  background: #1f6feb;
  border-color: #388bfd;
  color: #fff;
}

.btn-refresh {
  padding: 4px 10px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: #2a2f36;
  border-color: #8b949e;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tag-filter {
  position: relative;
}

.btn-filter {
  padding: 4px 10px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-filter:hover {
  background: #2a2f36;
}

.btn-filter.active {
  background: #1f6feb;
  border-color: #388bfd;
  color: #fff;
}

.tag-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  min-width: 200px;
  padding: 8px;
  z-index: 200;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.tag-item {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #c9d1d9;
  transition: background 0.2s;
}

.tag-item:hover {
  background: #161b22;
}

.tag-item.include {
  background: #238636;
  color: #fff;
}

.tag-item.exclude {
  background: #da3633;
  color: #fff;
}

.tag-dropdown-actions {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #30363d;
  display: flex;
  justify-content: flex-end;
}

.btn-clear {
  background: none;
  border: none;
  color: #8b949e;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-clear:hover {
  color: #f85149;
}

.placeholder-msg {
  color: #8b949e;
  font-size: 0.85rem;
  text-align: center;
}

.library-loading, .library-error {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #8b949e;
  font-size: 0.9rem;
  gap: 12px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #238636;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* Card View */
.library-content.card {
  display: grid;
  grid-auto-rows: min-content;
  gap: 12px;
  align-content: start;
  padding-bottom: 24px;
}

.card-item {
  aspect-ratio: 3/4;
  border: 2px solid #30363d;
  border-radius: 10px;
  overflow: visible;
  background: #11161c;
  position: relative;
  cursor: pointer;
  transition: border-color .15s ease;
  z-index: 1;
}

.selection-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  background: rgba(13, 17, 23, 0.8);
  border-radius: 6px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.selection-checkbox input {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.card-item:hover {
  border-color: #388bfd;
  z-index: 10;
}

.card-image {
  width: 100%;
  height: 100%;
  background: #222;
  border-radius: 9px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: opacity 0.3s;
}

.card-image.lazy {
  opacity: 0;
}

.card-image.loaded {
  opacity: 1;
}

.card-image.error {
  opacity: 1;
  background: #2a2f36; /* Distinct placeholder color */
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image.error::after {
  content: 'No Image';
  color: #8b949e;
  font-size: 0.75rem;
}

.card-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  pointer-events: none;
}

.card-title {
  color: #f0f6fc;
  font-weight: 500;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dense-view .card-title {
  display: none;
}

.card-tags {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  gap: 4px;
  mask-image: linear-gradient(to right, black 90%, transparent 100%);
}

.tag {
  padding: 2px 6px;
  border-radius: 999px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Tooltip Styles - Sync width with parent card to avoid horizontal overflow */
.card-tooltip {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 100;
  box-sizing: border-box;
}

.card-tooltip.bottom {
  top: 100%;
  margin-top: 8px;
}

.card-tooltip.top {
  bottom: 100%;
  margin-bottom: 8px;
}

.tooltip-name {
  color: #fff;
  font-weight: 600;
  margin-bottom: 8px;
  word-break: break-word;
  font-size: 0.9rem;
}

.tooltip-tags {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.tooltip-tags .tag {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #30363d;
  border-radius: 8px;
  background: #0d1117;
  cursor: pointer;
}

.list-checkbox {
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
}

.list-checkbox input {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.list-item:hover {
  border-color: #388bfd;
}

.list-name {
  flex: 1;
  font-weight: 600;
  color: #e6edf3;
}

.list-tags {
  display: flex;
  gap: 4px;
}
</style>
