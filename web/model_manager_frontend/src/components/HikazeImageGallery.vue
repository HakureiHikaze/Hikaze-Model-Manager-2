<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchImageCount, deleteImage } from '../api/models'

const props = defineProps<{
  sha256: string
}>()

const emit = defineEmits(['update'])

const imageCount = ref(0)
const currentIndex = ref(0)
const isLoading = ref(false)
const isHovering = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const loadImages = async () => {
  if (!props.sha256) return
  isLoading.value = true
  try {
    imageCount.value = await fetchImageCount(props.sha256)
    // If current index is out of bounds after count update, reset to last available or 0
    if (currentIndex.value >= imageCount.value && imageCount.value > 0) {
      currentIndex.value = imageCount.value - 1
    } else if (imageCount.value === 0) {
      currentIndex.value = 0
    }
  } catch (e) {
    console.error('Failed to load image count:', e)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.sha256, () => {
  currentIndex.value = 0
  loadImages()
}, { immediate: true })

const nextImage = () => {
  if (imageCount.value > 0) {
    currentIndex.value = (currentIndex.value + 1) % imageCount.value
  }
}

const prevImage = () => {
  if (imageCount.value > 0) {
    currentIndex.value = (currentIndex.value - 1 + imageCount.value) % imageCount.value
  }
}

const handleDelete = async () => {
  if (imageCount.value === 0) return
  if (!confirm('Are you sure you want to delete this image?')) return
  
  try {
    await deleteImage(props.sha256, currentIndex.value)
    await loadImages()
    emit('update')
  } catch (e) {
    alert('Failed to delete image')
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)
  formData.append('sha256', props.sha256)
  
  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      await loadImages()
      currentIndex.value = imageCount.value - 1 // Go to the new image
      emit('update')
    } else {
      const err = await response.json()
      alert(`Upload failed: ${err.error || response.statusText}`)
    }
  } catch (e) {
    alert('Upload error')
  } finally {
    input.value = '' // Reset
  }
}

// Helper for image URL
const getImageUrl = (seq: number) => {
  return `/api/images/${props.sha256}.webp?seq=${seq}&quality=high&t=${Date.now()}` // t for cache busting
}
</script>

<template>
  <div 
    class="image-gallery"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="main-display">
      <div v-if="isLoading" class="loader">Loading...</div>
      <template v-else-if="imageCount > 0">
        <img :src="getImageUrl(currentIndex)" class="gallery-img" />
        
        <!-- Navigation Arrows -->
        <transition name="fade">
          <div v-show="isHovering && imageCount > 1" class="nav-controls">
            <button class="nav-btn prev" @click.stop="prevImage">‹</button>
            <button class="nav-btn next" @click.stop="nextImage">›</button>
          </div>
        </transition>

        <!-- Central Controls -->
        <transition name="fade">
          <div v-show="isHovering" class="action-overlay">
            <button class="action-btn upload" @click.stop="triggerUpload" title="Add Image">➕</button>
            <button class="action-btn delete" @click.stop="handleDelete" title="Delete Current Image">🗑️</button>
          </div>
        </transition>
      </template>
      <div v-else class="no-images">
        <div class="placeholder">No Images</div>
        <button class="btn-upload-init" @click="triggerUpload">Upload Image</button>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div v-if="imageCount > 1" class="pagination">
      <div 
        v-for="i in imageCount" 
        :key="i-1" 
        class="dot" 
        :class="{ active: currentIndex === i-1 }"
        @click="currentIndex = i-1"
      ></div>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*"
      @change="handleUpload"
    />
  </div>
</template>

<style scoped>
.image-gallery {
  width: 100%;
  aspect-ratio: 3/4;
  background: #151b23;
  border: 1px solid #30363d;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-display {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.no-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #484f58;
}

.placeholder {
  font-size: 1.2rem;
  font-weight: 600;
}

.btn-upload-init {
  padding: 6px 12px;
  background: #238636;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.loader {
  color: #8b949e;
}

/* Nav Controls */
.nav-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(0,0,0,0.8);
}

/* Action Overlay */
.action-overlay {
  position: absolute;
  display: flex;
  gap: 16px;
  z-index: 10;
}

.action-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(255,255,255,0.3);
}

.action-btn.delete:hover {
  background: rgba(248, 81, 73, 0.4);
  border-color: #f85149;
}

/* Pagination */
.pagination {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: #238636;
  transform: scale(1.2);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>