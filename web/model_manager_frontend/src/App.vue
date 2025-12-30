<script setup lang="ts">
import { computed, onMounted } from 'vue'
import HikazeManagerLayout from './components/HikazeManagerLayout.vue'
import ModelLibrary from './components/ModelLibrary.vue'
import ModelDetails from './components/ModelDetails.vue'
import HikazeFloatingPanel from './components/HikazeFloatingPanel.vue'
import { useUIStore } from './store/ui'

const uiStore = useUIStore()

const isEmbedded = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('embedded') === 'true'
})

const initialTab = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('initialTab') || undefined
})

onMounted(() => {
  // Test dynamic buttons
  uiStore.addButton({
    id: 'exit',
    label: 'Exit',
    icon: '🚪',
    callback: () => {
      if (confirm('Exit manager?')) {
        window.close()
      }
    }
  })
})
</script>

<template>
  <HikazeManagerLayout :embedded="isEmbedded" :initialTab="initialTab">
    <template #library="{ activeTab }">
      <ModelLibrary :active-tab="activeTab" />
    </template>
    
    <template #details>
      <ModelDetails />
    </template>

    <!-- Global Floating Panel -->
    <HikazeFloatingPanel container-selector=".hikaze-layout" />
  </HikazeManagerLayout>
</template>



<style>

/* Global styles for the app */

</style>
