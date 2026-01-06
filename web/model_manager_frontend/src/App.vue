<script setup lang="ts">
import { computed, ref } from 'vue'
import HikazeManagerLayout from './components/HikazeManagerLayout.vue'
import FloatingToolbar from './components/FloatingToolbar.vue'
import ModelLibrary from './components/ModelLibrary.vue'
import ModelDetails from './components/ModelDetails.vue'
import type { Model } from '@shared/types/model_record'

const isEmbedded = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('embedded') === 'true'
})

const initialTab = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('initialTab') || undefined
})

const selectedModel = ref<Model | undefined>(undefined)

const handleSelectModel = (model: Model) => {
  selectedModel.value = model
}
</script>

<template>
  <HikazeManagerLayout :embedded="isEmbedded" :initialTab="initialTab">
    <template #library="{ activeTab }">
      <ModelLibrary 
        :active-tab="activeTab" 
        @select-model="handleSelectModel"
      />
    </template>

    <template #details>
      <ModelDetails 
        :model="selectedModel" 
        @update-list="() => { /* Trigger list refresh if needed */ }"
      />
    </template>

    <template #toolbar="{ activeTab }">
      <FloatingToolbar v-if="!isEmbedded" :active-tab="activeTab" />
    </template>
  </HikazeManagerLayout>
</template>

<style>
/* Global styles for the app */
</style>
