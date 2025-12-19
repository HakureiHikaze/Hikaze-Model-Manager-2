<template>
  <div class="hikaze-checkpoint-content">
    <div class="path-display" :title="currentPath">
      <div class="label">Current Path:</div>
      <div class="value">
        {{ currentPath || '(No path selected)' }}
      </div>
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="selectPath">
        Select Checkpoint...
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'

const props = defineProps<{
  nodeId: string | number
  payload: Ref<string>
  commit: (next: string) => void
}>()

const currentPath = computed(() => {
  try {
    const parsed = JSON.parse(props.payload.value || '{}')
    return parsed.ckpt_path || ''
  } catch {
    return ''
  }
})

function selectPath() {
  const current = currentPath.value
  const next = window.prompt('Enter absolute checkpoint path', current)
  if (next != null && next !== current) {
    props.commit(JSON.stringify({ ckpt_path: next }))
  }
}
</script>

<style scoped>
.hikaze-checkpoint-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

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

.actions {
  display: flex;
  justify-content: flex-end;
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
