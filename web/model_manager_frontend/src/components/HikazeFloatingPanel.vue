<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUIStore } from '../store/ui';

const props = defineProps<{
  containerSelector?: string; // Selector for the parent container to constrain movement
  embedded?: boolean;
}>();

const uiStore = useUIStore();

const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const panelRef = ref<HTMLElement | null>(null);

const onMouseDown = (e: MouseEvent) => {
  if (!panelRef.value) return;
  
  // Only drag if clicking the handle
  if (!(e.target as HTMLElement).closest('.drag-handle')) return;

  isDragging.value = true;
  const rect = panelRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !panelRef.value) return;

  let newX = e.clientX - dragOffset.value.x;
  let newY = e.clientY - dragOffset.value.y;

  // Constrain to container
  const container = props.containerSelector 
    ? document.querySelector(props.containerSelector) 
    : panelRef.value.parentElement;

  if (container) {
    const cRect = container.getBoundingClientRect();
    const pRect = panelRef.value.getBoundingClientRect();

    if (newX < cRect.left) newX = cRect.left;
    if (newX + pRect.width > cRect.right) newX = cRect.right - pRect.width;
    if (newY < cRect.top) newY = cRect.top;
    if (newY + pRect.height > cRect.bottom) newY = cRect.bottom - pRect.height;
    
    // Convert to relative coordinates from bottom-right for persistence/style
    uiStore.setPanelPosition(
      Math.max(0, cRect.right - (newX + pRect.width)),
      Math.max(0, cRect.bottom - (newY + pRect.height))
    );
  }
};

const onMouseUp = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

onMounted(() => {
  uiStore.refreshPendingCount();
});

const panelStyle = computed(() => ({
  right: `${uiStore.panelPosition.x}px`,
  bottom: `${uiStore.panelPosition.y}px`,
}));

const handlePendingClick = () => {
  // Logic to navigate to migration view (to be implemented)
  console.log('Pending models clicked');
};
</script>

<template>
  <div 
    ref="panelRef"
    class="hikaze-floating-panel"
    :style="panelStyle"
    :class="{ 'is-dragging': isDragging }"
  >
    <div class="panel-content">
      <!-- Drag Handle -->
      <div class="drag-handle" @mousedown="onMouseDown">
        <span class="grip-icon">⋮⋮</span>
      </div>

      <div class="divider"></div>

      <div class="fixed-actions">
        <button 
          class="panel-btn pending" 
          :class="{ active: uiStore.pendingCount > 0 }"
          @click="handlePendingClick"
          title="Pending Imports"
        >
          <span class="btn-icon">📦</span>
          <span v-if="uiStore.pendingCount > 0" class="btn-badge">
            {{ uiStore.pendingCount }}
          </span>
        </button>
      </div>

      <div class="divider" v-if="uiStore.dynamicButtons.length > 0"></div>
      
      <div class="button-group">
        <button 
          v-for="btn in uiStore.dynamicButtons" 
          :key="btn.id"
          :class="['panel-btn', btn.styleClass]"
          @click="btn.callback"
          :title="btn.label"
        >
          <span v-if="btn.icon" class="btn-icon">{{ btn.icon }}</span>
          <span class="btn-label">{{ btn.label }}</span>
          <span v-if="btn.badge !== undefined && btn.badge !== 0" class="btn-badge">
            {{ btn.badge }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hikaze-floating-panel {
  position: absolute;
  z-index: 1000;
  background: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid #30363d;
  border-radius: 32px;
  padding: 4px 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  user-select: none;
  display: flex;
  align-items: center;
  transition: background 0.3s, border-color 0.3s, transform 0.1s;
}

.hikaze-floating-panel:hover {
  background: rgba(22, 27, 34, 0.95);
  border-color: #444c56;
}

.hikaze-floating-panel.is-dragging {
  transform: scale(1.02);
  border-color: #388bfd;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
}

.drag-handle {
  width: 24px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #484f58;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #8b949e;
}

.hikaze-floating-panel.is-dragging .drag-handle {
  cursor: grabbing;
  color: #388bfd;
}

.grip-icon {
  font-size: 1.2rem;
  letter-spacing: -2px;
}

.divider {
  width: 1px;
  height: 24px;
  background: #30363d;
  margin: 0 8px;
}

.button-group, .fixed-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.panel-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background: transparent;
  border: 1px solid transparent;
  color: #c9d1d9;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.panel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #444c56;
}

.panel-btn.pending {
  color: #8b949e;
}
.panel-btn.pending.active {
  color: #e3b341; /* Warning/Yellow for pending models */
}

.panel-btn.primary {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}
.panel-btn.primary:hover {
  background: #2ea043;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-label {
  white-space: nowrap;
}

.btn-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #f85149;
  color: #fff;
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  border: 2px solid #161b22;
  transform: translate(25%, -25%);
}

.panel-content {
  display: flex;
  align-items: center;
}
</style>

