<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { fetchModelTypes } from '../api/models';
import { useModelStore } from '../store/models';
import HikazeFloatingPanel from './HikazeFloatingPanel.vue';

const props = defineProps<{
  embedded?: boolean;
  initialTab?: string;
}>()

const modelStore = useModelStore();

const activeTab = ref<string>('');
const modelTypes = ref<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Sidebar Resize Logic
const sidebarWidth = ref(350);
const isResizing = ref(false);

const startResize = () => {
  isResizing.value = true;
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const onResize = (e: MouseEvent) => {
  if (!isResizing.value) return;
  const newWidth = window.innerWidth - e.clientX;
  if (newWidth > 200 && newWidth < 800) {
    sidebarWidth.value = newWidth;
  }
};

const stopResize = () => {
  isResizing.value = false;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

const layoutStyle = computed(() => ({
  gridTemplateColumns: `1fr ${sidebarWidth.value}px`
}));

function setActiveTab(type: string) {
  activeTab.value = type;
}

// Watch for tab changes and load models
watch(activeTab, (newTab) => {
  if (newTab) {
    modelStore.loadModels(newTab);
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
    if (initial && modelTypes.value.includes(initial)) {
      activeTab.value = initial;
    } else if (modelTypes.value.length > 0) {
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
  // Initialize width to ~24% if window allows
  const preferred = window.innerWidth * 0.24;
  if (preferred > 200 && preferred < 800) {
    sidebarWidth.value = preferred;
  }
});
</script>

<template>
  <div 
    class="hikaze-layout" 
    :class="{ 'is-embedded': embedded, 'has-initial-tab': !!initialTab }"
    :style="layoutStyle"
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
    </header>

    <!-- Main Content Area (Library) -->
    <main class="hikaze-pane-library">
      <slot name="library" :active-tab="activeTab">Library</slot>
    </main>

    <!-- Drag Handle -->
    <div class="resize-handle" @mousedown="startResize"></div>

    <!-- Right Sidebar (Details) -->
    <aside class="hikaze-pane-details">
      <slot name="details">Details</slot>
    </aside>

    <!-- Global Floating Panel -->
    <HikazeFloatingPanel 
      container-selector=".hikaze-layout" 
      :embedded="embedded"
    />
  </div>
</template>

<style scoped>
.hikaze-layout {
  display: grid;
  /* Columns defined via style binding */
  grid-template-rows: auto 1fr; /* Header | Content */
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-bg-primary, #0f1115);
  color: var(--color-text-primary, #c9d1d9);
  position: relative; /* Critical for absolute positioned overlays */
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

.hikaze-header::-webkit-scrollbar {
  height: 4px;
}

.hikaze-header::-webkit-scrollbar-track {
  background: #0d1117;
}

.hikaze-header::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;
}

.hikaze-header::-webkit-scrollbar-thumb:hover {
  background: #8b949e;
}

.type-tabs {
  display: flex;
  gap: 6px;
  white-space: nowrap; /* Prevent tabs from wrapping */
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
  background: #238636;
  border-color: #2ea043;
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

/* Library takes remaining space */
.hikaze-pane-library {
  grid-column: 1;
  grid-row: 2; /* If header exists, row 2. If not... handled below? No, always row 2 is fine if row 1 is auto (0 height if empty/v-if false) */
  overflow-y: hidden; /* Internal scrolling handled by components */
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove default padding, let children handle it */
  position: relative;
}

/* If header is hidden (v-if), the grid row 1 collapses? 
   No, v-if removes the element.
   If element is removed, grid-template-rows: auto 1fr; 
   The first row will have 0 height. Ideally we might want to change template rows.
*/

.hikaze-layout.is-embedded,
.hikaze-layout.has-initial-tab {
   /* No header displayed via v-if */
   /* grid-template-rows: 0fr 1fr;  Effective result */
}

/* Resize Handle */
.resize-handle {
  grid-column: 2; /* Sits on left edge of col 2, basically */
  grid-row: 2;
  width: 4px;
  margin-left: -2px; /* Center over border */
  cursor: col-resize;
  z-index: 10;
  height: 100%;
  background: transparent; /* Invisible hit area */
  position: relative; /* To place it */
}
.resize-handle:hover, .resize-handle:active {
  background: #1f6feb; /* Blue highlight on hover */
}

/* Details Sidebar */
.hikaze-pane-details {
  grid-column: 2;
  grid-row: 2; /* Spans from below header to bottom */
  border-left: 1px solid #2d333b;
  overflow-y: auto;
  background-color: #0d1117; /* Legacy detail bg */
}

/* When header is present, details also start at row 2 */
</style>
