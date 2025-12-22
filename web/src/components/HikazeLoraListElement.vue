<script setup lang="ts">
const props = defineProps<{
  seq: number;
  name: string;
  mstr: number;
  cstr: number;
  on: boolean;
}>()
const emits = defineEmits<{
  (e: 'update:mstr', seq: number, value: number): void
  (e: 'update:cstr', seq: number, value: number): void
  (e: 'update:on', seq: number, value: boolean): void
  (e: 'update:delete', seq: number): void
}>();
function onMStrInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emits('update:mstr', props.seq, input.valueAsNumber);
}
function onCStrInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emits('update:cstr', props.seq, input.valueAsNumber);
}
function onCheckboxInput(event: Event) {
  emits('update:on', props.seq, (event.target as HTMLInputElement).checked);
}
function onBtnDelete(event: Event) {
  emits('update:delete', props.seq);
}
</script>
<template>
  <tr>
    <td> <button class="del-btn" @click="onBtnDelete">&#128465;</button></td>
    <td>{{ props.seq + 1 }}</td>
    <td :title="props.name" class="lora-name">{{ props.name }}</td>
    <td>
      <input class="hikaze-reset-input" type="number" :value="props.mstr" step="0.05" @input="onMStrInput" />
    </td>
    <td>
      <input class="hikaze-reset-input" type="number" :value="props.cstr" step="0.05" @input="onCStrInput" />
    </td>
    <td class="center-chk">
      <input class="hikaze-reset-chk" type="checkbox" :checked="props.on" @input="onCheckboxInput" />
    </td>
  </tr>
</template>
<style scoped>
td {
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
