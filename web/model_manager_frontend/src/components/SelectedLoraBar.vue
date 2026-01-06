<script setup lang="ts">
import type { Tag } from '@shared/types/common'
import { useImageCache } from '../cache/images'

type SelectedLoraItem = {
  sha256: string
  name: string
  path: string
  tags: Tag[]
}

const props = defineProps<{
  items: SelectedLoraItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', sha256: string, nextSelected: boolean): void
  (e: 'select', item: SelectedLoraItem): void
}>()

const imageCache = useImageCache()

const handleToggle = (sha256: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('toggle', sha256, target.checked)
}

const handleSelect = (item: SelectedLoraItem) => {
  emit('select', item)
}

const getPreviewStyle = (sha256: string) => {
  if (!sha256) return {}
  return {
    backgroundImage: `url(${imageCache.getImageUrl(sha256, 0, 'medium')})`
  }
}
</script>

<template>
  <div class="selected-lora-bar">
    <div class="selected-lora-row" :class="{ empty: props.items.length === 0 }">
      <div v-if="props.items.length === 0" class="selected-lora-empty">
        No LoRAs selected.
      </div>
      <div
        v-else
        v-for="item in props.items"
        :key="item.sha256"
        class="selected-lora-card"
        @click="handleSelect(item)"
      >
        <label class="selection-checkbox" @click.stop>
          <input
            type="checkbox"
            checked
            @click.stop
            @change="(event) => handleToggle(item.sha256, event)"
          />
        </label>
        <div class="selected-lora-image" :style="getPreviewStyle(item.sha256)"></div>
        <div class="selected-lora-meta">
          <div class="selected-lora-name" :title="item.name || item.path">
            {{ item.name || item.path }}
          </div>
          <div v-if="item.tags.length > 0" class="selected-lora-tags">
            <span v-for="tag in item.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-lora-bar {
  padding: 10px 12px 8px;
  border-bottom: 1px solid #2d333b;
  background: #0f1115;
}

.selected-lora-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.selected-lora-row.empty {
  justify-content: center;
  color: #8b949e;
  font-size: 0.85rem;
  min-height: 64px;
  align-items: center;
}

.selected-lora-card {
  flex: 0 0 calc((100% - 40px) / 6);
  min-width: calc((100% - 40px) / 6);
  aspect-ratio: 3 / 4;
  border: 2px solid #30363d;
  border-radius: 10px;
  overflow: hidden;
  background: #11161c;
  position: relative;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
}

.selection-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  background: rgba(13, 17, 23, 0.8);
  border-radius: 6px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.selection-checkbox input {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.selected-lora-image {
  position: absolute;
  inset: 0;
  background: #222;
  background-size: cover;
  background-position: center;
}

.selected-lora-meta {
  position: relative;
  width: 100%;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  z-index: 2;
}

.selected-lora-name {
  font-size: 0.85rem;
  color: #f0f6fc;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-lora-tags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  overflow: hidden;
}

.tag {
  padding: 2px 6px;
  border-radius: 999px;
  background: #21262d;
  color: #c9d1d9;
  font-size: 0.7rem;
  white-space: nowrap;
}
</style>
