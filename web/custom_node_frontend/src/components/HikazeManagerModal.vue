<script setup lang="ts">
import { Teleport, onMounted, onUnmounted } from 'vue'
import { modalState, closeManager } from '../injection/modalService'
import HikazeManagerLayout from '@manager/components/HikazeManagerLayout.vue'
import ModelLibrary from '@manager/components/ModelLibrary.vue'
import ModelDetails from '@manager/components/ModelDetails.vue'

// Handle Escape key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (modalState.isOpen && e.key === 'Escape') {
    closeManager(null)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const onBackdropClick = () => {
  closeManager(null)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modalState.isOpen" class="hikaze-modal-backdrop" @click.self="onBackdropClick">
      <div class="hikaze-modal-content">
        <!-- 
          Reconstruct the manager layout.
          We pass initialTab from options if provided.
          For now, we hardcode 'embedded' to true to match the spec's intent (overlay).
        -->
        <HikazeManagerLayout 
          :embedded="true" 
          :initialTab="modalState.options?.initialTab"
        >
          <!-- Navigation: Replicated from App.vue -->
          <template #nav>
            <nav class="type-tabs">
              <div class="tab active">Checkpoints</div>
              <div class="tab">LoRAs</div>
              <div class="tab">Embeddings</div>
              <div class="tab">Hypernetworks</div>
              <div class="tab">ControlNet</div>
            </nav>
          </template>

          <template #library>
            <ModelLibrary />
          </template>

          <template #details>
            <ModelDetails />
          </template>
        </HikazeManagerLayout>
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
  z-index: 9000; /* High z-index to cover ComfyUI */
  display: flex;
  align-items: center;
  justify-content: center;
}

.hikaze-modal-content {
  width: 90vw;
  height: 90vh;
  background-color: var(--color-bg-primary, #0f1115);
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  display: flex; /* Ensure layout fills content */
  flex-direction: column;
}

/* Styles replicated from App.vue for tabs */
.type-tabs {
  display: flex;
  gap: 6px;
}

.type-tabs .tab {
  padding: 6px 10px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #c9d1d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.type-tabs .tab:hover {
  background: #2a2f36;
}

.type-tabs .tab.active {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}
</style>
