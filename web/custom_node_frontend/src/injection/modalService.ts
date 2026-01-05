import { ref, readonly } from 'vue'
import type { LoRAListDocument } from '@shared/types/lora_list'

export interface ModalOptions {
  /**
   * Selection mode: 'single' (checkpoints) or 'multi' (LoRAs).
   */
  mode: 'single' | 'multi'
  /**
   * Which tab to focus initially.
   */
  initialTab?: 'checkpoints' | 'loras'
  /**
   * Title for the modal header.
   */
  title?: string
  /**
   * For multi-select: Pre-selected SHA256 hashes.
   */
  selectedIds?: string[]
}

export type ModalResult = { ckpt_path: string } | LoRAListDocument | null

// Internal state
const isOpen = ref(false)
const options = ref<ModalOptions | null>(null)
let resolvePromise: ((result: ModalResult) => void) | null = null

export const modalState = readonly({
  isOpen,
  options
})

/**
 * Open the global model manager modal.
 * Returns a promise that resolves with the selected value(s) or null if cancelled.
 */
export function openManager(opts: ModalOptions): Promise<ModalResult> {
  // If already open, reject or close previous?
  // Ideally we shouldn't have overlapping modals.
  if (isOpen.value) {
    closeManager(null)
  }

  isOpen.value = true
  options.value = opts

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

/**
 * Close the modal and resolve the promise.
 * @param result The value to return (ckpt_path object, LoRAListDocument, or null for cancel).
 */
export function closeManager(result: ModalResult) {
  isOpen.value = false
  options.value = null

  if (resolvePromise) {
    resolvePromise(result)
    resolvePromise = null
  }
}
