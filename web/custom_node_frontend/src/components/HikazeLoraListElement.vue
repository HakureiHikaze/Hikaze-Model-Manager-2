<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  seq: number;
  name: string;
  strength_model: number;
  strength_clip: number;
  enabled: boolean;
}>()
const loRAName = computed(() => {
  if (!props.name) return '';
  return props.name.split(/[\\/]/).pop()?.replace(".safetensors", "") || '';
}
);
const emits = defineEmits<{
  (e: 'update:strength_model', seq: number, value: number): void
  (e: 'update:strength_clip', seq: number, value: number): void
  (e: 'update:enabled', seq: number, value: boolean): void
  (e: 'update:delete', seq: number): void
}>();

function onModelStrengthInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emits('update:strength_model', props.seq, input.valueAsNumber);
}
function onClipStrengthInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emits('update:strength_clip', props.seq, input.valueAsNumber);
}
function onEnabledInput(event: Event) {
  emits('update:enabled', props.seq, (event.target as HTMLInputElement).checked);
}
function onBtnDelete(event: Event) {
  emits('update:delete', props.seq);
}
</script>
<template>
  <tr>
    <td> <button class="del-btn" @click="onBtnDelete">&#128465;</button></td>
    <td>{{ props.seq + 1 }}</td>
    <td :title="loRAName" class="lora-name">{{ loRAName }}</td>
    <td>
      <input class="hikaze-reset-input" type="number" :value="props.strength_model" step="0.05" @input="onModelStrengthInput" />
    </td>
    <td>
      <input class="hikaze-reset-input" type="number" :value="props.strength_clip" step="0.05" @input="onClipStrengthInput" />
    </td>
    <td class="center-chk">
      <input class="hikaze-reset-chk" type="checkbox" :checked="props.enabled" @input="onEnabledInput" />
    </td>
  </tr>
</template>
<style scoped>
td {
  padding: 6px 4px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  vertical-align: middle;
  height: 32px;
}

.lora-name {
  text-align: left;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Defensive CSS for Number Inputs */
input.hikaze-reset-input {
  /* Reset */
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
  outline: none;
  margin: 0;

  /* Visuals */
  background-color: rgba(0, 0, 0, 0.3) !important;
  color: white !important;
  border: 1px solid #555 !important;
  border-radius: 4px !important;
  padding: 2px 4px !important;

  /* Typography */
  font-family: inherit;
  font-size: 12px;
  line-height: normal;

  /* Layout */
  width: 60px;
  max-width: 100%;
}

input.hikaze-reset-input:focus {
  border-color: #777 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* Defensive CSS for Checkbox */
input.hikaze-reset-chk {
  /* Ensure standard checkbox appearance or reset if custom needed */
  /* ComfyUI might override 'appearance' globally */
  appearance: auto;
  margin: 0 !important;
  width: 16px !important;
  height: 16px !important;
  cursor: pointer !important;
  filter: none !important;
  box-shadow: none !important;
  border: none !important;
  /* Some frameworks add borders to checkboxes */
  outline: none !important;
}

.center-chk {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.del-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ff6666;
  font-size: 16px;
  padding: 0 4px;
}

.del-btn:hover {
  color: #ff3333;
  transform: scale(1.1);
}
</style>
