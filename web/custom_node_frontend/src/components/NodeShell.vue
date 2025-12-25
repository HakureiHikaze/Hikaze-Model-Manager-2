<script setup lang="ts">
import { openManager, modalState } from '../injection/modalService'
import HikazeManagerModal from './HikazeManagerModal.vue'

const testOpen = async (mode: 'single' | 'multi') => {
  console.log('Opening manager...')
  const result = await openManager({ 
    mode, 
    initialTab: mode === 'single' ? 'checkpoints' : 'loras' 
  })
  console.log('Manager closed with result:', result)
}
</script>

<template>
  <div class="shell">
    <h1>Hikaze Dev Shell</h1>
    <div class="controls">
      <button @click="testOpen('single')">Open Manager (Single)</button>
      <button @click="testOpen('multi')">Open Manager (Multi)</button>
    </div>
    <div class="output">
       <p>State: {{ modalState.isOpen ? 'Open' : 'Closed' }}</p>
       <p>Options: {{ modalState.options }}</p>
    </div>

    <!-- Mount the modal component -->
    <HikazeManagerModal />
  </div>
</template>

<style>
body {
  background-color: #222;
  color: #ddd;
  font-family: sans-serif;
}
.shell {
  padding: 20px;
}
.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
