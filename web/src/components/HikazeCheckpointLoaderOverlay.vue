<template>
  <HikazeNodeShell
    :node-id="nodeId"
    title="Hikaze Checkpoint Loader"
  >
    <div class="path-display" :title="ckptPathRef.value">
      <div class="label">Current Path:</div>
      <div class="value">
        {{ ckptPathRef.value || '(No path selected)' }}
      </div>
    </div>

    <template #actions>
      <button type="button" class="btn" @click="selectPath">
        Select Checkpoint...
      </button>
    </template>
  </HikazeNodeShell>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import HikazeNodeShell from './HikazeNodeShell.vue'

const props = defineProps<{
  nodeId: string | number | null
  ckptPathRef: Ref<string>
  commitPath: (next: string) => void
}>()

function selectPath() {
  const current = props.ckptPathRef.value
  const next = window.prompt('Enter absolute checkpoint path', current)
  if (next != null && next !== current) {
    props.commitPath(next)
  }
}
</script>

<style scoped>
.path-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
}

.label {
  font-size: 11px;
  color: #8a93a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.value {
  font-family: monospace;
  font-size: 12px;
  color: #e8ecf2;
  word-break: break-all;
  line-height: 1.4;
}

.btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e8ecf2;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.12);
}
</style>
