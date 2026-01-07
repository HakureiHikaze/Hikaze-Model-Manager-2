<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useModelCache } from '../cache/models'
import { useTagsCache } from '../cache/tags'
import type { PendingModelSimpleRecord, Tag } from '@shared/types/model_record'
import { getApiBaseSync } from '@shared/util/sniffer_port'

const props = defineProps<{
  activeTab: string
  selectedIds?: number[]
  excludeSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-model', model: PendingModelSimpleRecord): void
  (e: 'toggle-select', model: PendingModelSimpleRecord, nextSelected: boolean): void
}>()

const pendingCache = useModelCache('pending')
const tagsCache = useTagsCache()

const viewMode = ref<'card' | 'list'>('card')
const columnCount = ref(4)
const showTagFilter = ref(false)

const searchQuery = ref('')
const tagFilters = ref<Map<number, 'include' | 'exclude'>>(new Map())

const selectedSet = computed(() => new Set(props.selectedIds ?? []))

const rawModels = pendingCache.getModels('pending')
const isLoading = pendingCache.isLoading('pending')
const error = pendingCache.getError('pending')

const matchesTab = (model: PendingModelSimpleRecord) => {
  if (!props.activeTab) return true
  if (props.activeTab === 'Others') {
    return !model.type
  }
  return model.type === props.activeTab
}

const filteredModels = computed(() => {
  let result = rawModels.value as PendingModelSimpleRecord[]

  result = result.filter(matchesTab)

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q)
    )
  }

  if (tagFilters.value.size > 0) {
    const includedIds = Array.from(tagFilters.value.entries())
      .filter(([_, state]) => state === 'include')
      .map(([id]) => id)

    const excludedIds = Array.from(tagFilters.value.entries())
      .filter(([_, state]) => state === 'exclude')
      .map(([id]) => id)

    result = result.filter((m) => {
      const modelTagIds = new Set(m.tags.map((t: Tag) => t.id))
      const hasAllIncluded = includedIds.every((id) => modelTagIds.has(id))
      const hasNoExcluded = !excludedIds.some((id) => modelTagIds.has(id))
      return hasAllIncluded && hasNoExcluded
    })
  }

  if (props.excludeSelected && selectedSet.value.size > 0) {
    result = result.filter((m) => !selectedSet.value.has(m.id))
  }

  return result
})

const allTags = tagsCache.getTags()

const availableTags = computed(() => {
  const tagCounts = new Map<number, number>()
  filteredModels.value.forEach((model) => {
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

const normalizePendingImageName = (image: string) => {
  if (!image) return ''
  const normalized = image.replace(/\\/g, '/')
  const parts = normalized.split('/')
  return parts[parts.length - 1] || ''
}

const getPendingImageUrl = (image: string) => {
  const name = normalizePendingImageName(image)
  if (!name) return ''
  const base = getApiBaseSync()
  const prefix = base ? `${base}` : ''
  return `${prefix}/api/images/pending/${encodeURIComponent(name)}`
}

const refresh = () => {
  pendingCache.invalidate('pending')
  pendingCache.loadModels('pending', true)
}

const toggleSelection = (model: PendingModelSimpleRecord, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('toggle-select', model, target.checked)
}

const selectModel = (model: PendingModelSimpleRecord) => {
  emit('select-model', model)
}

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

const setView = (mode: 'card' | 'list') => {
  viewMode.value = mode
}

const gridStyle = computed(() => {
  if (viewMode.value !== 'card') return {}
  return {
    gridTemplateColumns: `repeat(${columnCount.value}, 1fr)`
  }
})

onMounted(async () => {
  pendingCache.loadModels('pending')
  try {
    await tagsCache.loadTags()
    const nsfwTag = allTags.value.find((t) => t.name.toLowerCase() === 'nsfw')
    if (nsfwTag) {
      tagFilters.value.set(nsfwTag.id, 'exclude')
    }
  } catch (e) {
    console.error('Failed to load tags for auto-exclude:', e)
  }
})
</script>

<template>
  <div class="pending-library">
    <div class="library-toolbar">
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search pending models..." />
      </div>

      <div class="controls-right">
        <div class="column-control" v-if="viewMode === 'card'">
          <label for="pending-col-count">Cols:</label>
          <input id="pending-col-count" type="number" v-model.number="columnCount" min="2" max="10" step="1" />
        </div>

        <div class="view-switch">
          <button :class="{ active: viewMode === 'card' }" @click="setView('card')">Card</button>
          <button :class="{ active: viewMode === 'list' }" @click="setView('list')">List</button>
        </div>

        <button class="btn-refresh" @click="refresh" :disabled="isLoading" title="Refresh pending models">
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
        <span class="spinner"></span> Loading pending models...
      </div>
      <div v-else-if="error" class="library-error">
        {{ error }}
      </div>
      <template v-else-if="viewMode === 'card'">
        <div 
          v-for="model in filteredModels" 
          :key="model.id" 
          class="card-item"
          :class="{ selected: selectedSet.has(model.id) }"
          @click="selectModel(model)"
        >
          <label class="selection-checkbox" @click.stop>
            <input
              type="checkbox"
              :checked="selectedSet.has(model.id)"
              @click.stop
              @change="(event) => toggleSelection(model, event)"
            />
          </label>
          <div 
            class="card-image"
            :class="{ empty: !model.image }"
            :style="model.image ? { backgroundImage: `url(${getPendingImageUrl(model.image)})` } : {}"
          ></div>
          <div class="card-meta">
            <div class="card-title">{{ model.name }}</div>
            <div class="card-tags">
              <span v-for="tag in model.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="list-container">
          <div 
            v-for="model in filteredModels" 
            :key="model.id" 
            class="list-item"
            :class="{ selected: selectedSet.has(model.id) }"
            @click="selectModel(model)"
          >
            <label class="list-checkbox" @click.stop>
              <input
                type="checkbox"
                :checked="selectedSet.has(model.id)"
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
.pending-library {
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
  background: var(--hikaze-accent, #d29922);
  border-color: var(--hikaze-accent-border, #b0881b);
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
  background: var(--hikaze-accent, #d29922);
  border-color: var(--hikaze-accent-border, #b0881b);
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
  border-top-color: var(--hikaze-accent, #d29922);
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

.card-item.selected {
  border-color: var(--hikaze-accent, #d29922);
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

.card-image {
  width: 100%;
  height: 100%;
  background: #222;
  border-radius: 9px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.card-image.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image.empty::after {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.list-item.selected {
  border-color: var(--hikaze-accent, #d29922);
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
