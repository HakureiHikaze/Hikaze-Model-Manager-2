<script setup lang="ts">
import { computed } from 'vue'
import HikazeManagerLayout from './components/HikazeManagerLayout.vue'
import ModelLibrary from './components/ModelLibrary.vue'
import ModelDetails from './components/ModelDetails.vue'

const isEmbedded = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('embedded') === 'true'
})

const initialTab = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('initialTab') || undefined
})
</script>

<template>
  <HikazeManagerLayout :embedded="isEmbedded" :initialTab="initialTab">
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
</template>

<style>
/* Scoped styles for nav content injected into layout slot */
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