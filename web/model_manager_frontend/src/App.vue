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

    <template #library>

      <ModelLibrary />

    </template>

    

    <template #details>

      <ModelDetails />

    </template>

  </HikazeManagerLayout>

</template>



<style>

/* Global styles for the app */

</style>
