<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchTags } from '../api/models'
import type { Tag } from '@shared/types/model_record'

const props = defineProps<{
  modelValue: Tag[]
}>()

const emit = defineEmits(['update:modelValue'])

const availableTags = ref<Tag[]>([])
const inputValue = ref('')
const isFocused = ref(false)
const showSuggestions = ref(false)

const loadAvailableTags = async () => {
  try {
    availableTags.value = await fetchTags()
  } catch (e) {
    console.error('Failed to load tags:', e)
  }
}

onMounted(loadAvailableTags)

const suggestions = computed(() => {
  const query = inputValue.value.toLowerCase().trim()
  if (!query) return []
  return availableTags.value
    .filter(t => t.name.toLowerCase().includes(query) && !props.modelValue.find(mt => mt.id === t.id))
    .slice(0, 10)
})

const removeTag = (index: number) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}

const addTag = (tag: Tag) => {
  if (!props.modelValue.find(t => t.id === tag.id)) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  inputValue.value = ''
  showSuggestions.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    const val = inputValue.value.trim().replace(/,$/, '')
    if (!val) return

    // Check if it matches an existing tag
    const existing = availableTags.value.find(t => t.name.toLowerCase() === val.toLowerCase())
    if (existing) {
      addTag(existing)
    } else {
      // It's a new tag. We represent it as a Tag with id -1 for now
      if (!props.modelValue.find(t => t.name.toLowerCase() === val.toLowerCase())) {
        emit('update:modelValue', [...props.modelValue, { id: -1, name: val }])
      }
      inputValue.value = ''
    }
    showSuggestions.value = false
  } else if (e.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

const onInput = () => {
  showSuggestions.value = true
}

const onBlur = () => {
  // Delay to allow click on suggestion
  setTimeout(() => {
    isFocused.value = false
    showSuggestions.value = false
  }, 200)
}
</script>

<template>
  <div class="tag-input-container" :class="{ focused: isFocused }">
    <div class="chips-wrapper">
      <div v-for="(tag, i) in modelValue" :key="tag.id === -1 ? tag.name : tag.id" class="tag-chip" :class="{ new: tag.id === -1 }">
        {{ tag.name }}
        <button class="remove-btn" @click="removeTag(i)">×</button>
      </div>
      <input 
        type="text" 
        v-model="inputValue" 
        @keydown="handleKeydown"
        @input="onInput"
        @focus="isFocused = true"
        @blur="onBlur"
        placeholder="Add tags..."
        class="input-field"
      />
    </div>

    <!-- Autocomplete Suggestions -->
    <transition name="slide-fade">
      <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-list">
        <div 
          v-for="tag in suggestions" 
          :key="tag.id" 
          class="suggestion-item"
          @mousedown="addTag(tag)"
        >
          {{ tag.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* (styles unchanged) */
.tag-input-container {
  position: relative;
  background: #0f141a;
  border: 1px solid #30363d;
  border-radius: 6px;
  min-height: 42px;
  display: flex;
  transition: border-color 0.2s;
}

.tag-input-container.focused {
  border-color: #1f6feb;
}

.chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  width: 100%;
}

.tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #238636;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
  line-height: 1.5;
}

.tag-chip.new {
  background: #6e7681; /* Gray for unsaved/new tags */
  font-style: italic;
}

.remove-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.remove-btn:hover {
  opacity: 1;
}

.input-field {
  flex: 1;
  min-width: 120px;
  border: none !important;
  background: transparent !important;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 0.9rem;
  padding: 2px 4px !important;
  outline: none !important;
}

.suggestions-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.suggestion-item:hover {
  background: #1f6feb;
  color: white;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>