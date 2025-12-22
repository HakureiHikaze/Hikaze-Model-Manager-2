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
      <input type="number" :value="props.mstr" step="0.05" @input="onMStrInput" />
    </td>
    <td>
      <input type="number" :value="props.cstr" step="0.05" @input="onCStrInput" />
    </td>
    <td class="center-chk"><input type="checkbox" :checked="props.on" @input="onCheckboxInput" /></td>
  </tr>
</template>
<style scoped>
td {
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.lora-name {
  text-align: left;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
input[type="number"] {
  width: 60px;
  background: rgba(0,0,0,0.3);
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px;
}
input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
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
