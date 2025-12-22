<template>
  <HikazeNodeFrame :node-id="nodeId" title="Hikaze Checkpoint Loader">
    <template #header-actions>
      <button type="button" class="btn header-action-btn" @click="selectPath">
        Select Checkpoint...
      </button>
    </template>

    <div class="hikaze-checkpoint-content">
      <div class="path-display" :title="currentPath">
        <div class="label">Current Path:</div>
        <div class="value">
          {{ currentPath || '(No path selected)' }}
        </div>
      </div>
    </div>
  </HikazeNodeFrame>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import HikazeNodeFrame from './HikazeNodeFrame.vue'

const props = defineProps<{
  nodeId: string | number
  payload: Ref<string>
  commit: (next: string) => void
  title?: string // Passed by controller but optional since we hardcode it for now or use prop
}>()

// Use prop title if available, or hardcode. Frame handles styling.
// Actually BaseController passes title. Let's use it?
// The template above uses "Hikaze Checkpoint Loader".
// Let's use the prop if passed, or fallback.
// But BaseController passes "Hikaze Node" as default title if node.title is generic.
// Let's stick to the specific title for this component.

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

.header-action-btn {
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.header-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
