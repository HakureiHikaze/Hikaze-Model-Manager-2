<template>
  <div class="hikaze-base-container">
    <slot>
      <!-- Placeholder content. Subclasses can provide their own body via slots or composition. -->
      <div class="placeholder">Attach your node UI here.</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
// This component is intended to be reused by child node-specific UIs.
// It does not fetch data or wire ComfyUI props yet; subclasses should handle that.
</script>

<style scoped>
.hikaze-base-container {
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}

.placeholder {
  color: #9fb1d1;
  font-size: 14px;
}
</style>
