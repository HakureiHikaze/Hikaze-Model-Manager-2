<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { fetchModelTypes } from '../api/models';
import { useModelCache } from '../cache/models';
import { useTagsCache } from '../cache/tags';

const props = defineProps<{
  embedded?: boolean;
  initialTab?: string;
  mode?: 'active' | 'pending';
}>()

const modelCache = useModelCache();
const tagsCache = useTagsCache();

const activeTab = ref<string>('');
const modelTypes = ref<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Resizability state
const detailsWidthPct = ref(24);
const isDragging = ref(false);

function setActiveTab(type: string) {
  activeTab.value = type;
}

// Resizing logic
function startDragging() {
  isDragging.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopDragging);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const containerWidth = window.innerWidth;
  const newWidthPx = containerWidth - e.clientX;
  const newPct = (newWidthPx / containerWidth) * 100;
  
  // Constrain between 10% and 80%
  if (newPct > 10 && newPct < 80) {
    detailsWidthPct.value = newPct;
  }
}

function stopDragging() {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopDragging);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
}

onUnmounted(() => {
  stopDragging();
});

// Watch for tab changes and load models
watch(activeTab, (newTab) => {
  if (newTab) {
    modelCache.loadModels(newTab);
  }
});

async function loadModelTypes() {
  isLoading.value = true;
  error.value = null;
  try {
    const types = await fetchModelTypes();
    modelTypes.value = [...types, 'Others'];
    
    // Resolve initial active tab
    const initial = props.initialTab;
    if (initial) {
      const exactMatch = modelTypes.value.find((type) => type === initial);
      const caseMatch = modelTypes.value.find(
        (type) => type.toLowerCase() === initial.toLowerCase()
      );
      const resolved = exactMatch || caseMatch;
      if (resolved) {
        activeTab.value = resolved;
        return;
      }
    }
    if (modelTypes.value.length > 0) {
      activeTab.value = modelTypes.value[0] || '';
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load model types';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadModelTypes();
  tagsCache.loadTags();
});
</script>

<template>
  <div
    class="hikaze-layout"
    :class="{
      'is-embedded': embedded,
      'has-initial-tab': !!initialTab,
      'is-pending': mode === 'pending'
    }"
    :style="{ gridTemplateColumns: `1fr 4px ${detailsWidthPct}%` }"
  >
    <!-- Top Navigation (Tabs) - Only visible if NOT embedded AND NO initialTab -->
    <header class="hikaze-header" v-if="!embedded && !initialTab">
      <div v-if="isLoading" class="tabs-loading">
        <span class="spinner"></span> Loading types...
      </div>
      <div v-else-if="error" class="tabs-error">
        {{ error }} <button @click="loadModelTypes" class="btn-retry">Retry</button>
      </div>
      <nav v-else class="type-tabs">
        <div 
          v-for="type in modelTypes" 
          :key="type"
          class="tab"
          :class="{ active: activeTab === type }"
          @click="setActiveTab(type)"
        >
          {{ type }}
        </div>
      </nav>
      <div v-if="mode === 'pending'" class="mode-indicator">Pending Mode</div>
    </header>

    <!-- Main Content Area (Library) -->
    <main class="hikaze-pane-library">
      <slot name="library" :active-tab="activeTab">Library</slot>
    </main>

    <!-- Resizable Splitter -->
    <div class="layout-splitter" :class="{ dragging: isDragging }" @mousedown="startDragging"></div>

    <!-- Right Sidebar (Details) -->
    <aside class="hikaze-pane-details">
      <slot name="details">Details</slot>
    </aside>

    <slot name="toolbar" :active-tab="activeTab"></slot>
  </div>
</template>

<style scoped>
.hikaze-layout {
  display: grid;
  /* grid-template-columns is set dynamically via :style */
  grid-template-rows: auto 1fr; /* Header | Content */
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-bg-primary, #0f1115);
  color: var(--color-text-primary, #c9d1d9);
  --hikaze-accent: #238636;
  --hikaze-accent-border: #2ea043;
}

.hikaze-layout.is-pending {
  --hikaze-accent: #d29922;
  --hikaze-accent-border: #b0881b;
}

/* Header spans full width */
.hikaze-header {
  grid-column: 1 / -1;
  grid-row: 1;
  background-color: #161b22; /* Legacy toolbar bg */
  border-bottom: 1px solid #2d333b;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  overflow-x: auto; /* Enable horizontal scroll for many tabs */
}

/* ... existing scrollbar styles ... */

.type-tabs {
  display: flex;
  gap: 6px;
  white-space: nowrap; /* Prevent tabs from wrapping */
}

.mode-indicator {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(210, 153, 34, 0.2);
  color: #f0f6fc;
  border: 1px solid rgba(210, 153, 34, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.type-tabs .tab {
  padding: 6px 12px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #c9d1d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  user-select: none;
  transition: all 0.2s ease;
}

.type-tabs .tab:hover {
  background: #2a2f36;
  border-color: #8b949e;
}

.type-tabs .tab.active {
  background: var(--hikaze-accent);
  border-color: var(--hikaze-accent-border);
  color: #fff;
}

.tabs-loading, .tabs-error {
  font-size: 0.85rem;
  color: #8b949e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-retry {
  padding: 2px 8px;
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  border-radius: 4px;
  cursor: pointer;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #238636;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Library takes column 1 */
.hikaze-pane-library {
  grid-column: 1;
  grid-row: 2;
  overflow-y: hidden; /* Internal scrolling handled by components */
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
}

/* Splitter takes column 2 */
.layout-splitter {
  grid-column: 2;
  grid-row: 2;
  width: 4px;
  cursor: col-resize;
  background-color: #2d333b;
  transition: background-color 0.2s;
  z-index: 10;
}

.layout-splitter:hover, .layout-splitter.dragging {
  background-color: #1f6feb;
}

/* Details Sidebar takes column 3 */
.hikaze-pane-details {
  grid-column: 3;
  grid-row: 2;
  overflow-y: auto;
  background-color: #0d1117; /* Legacy detail bg */
}
</style>
