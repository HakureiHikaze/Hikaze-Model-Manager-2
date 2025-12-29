import { ref, reactive, computed } from 'vue';
import { fetchModels, type Model } from '../api/models';

/**
 * Global reactive state for models to ensure caching across components.
 */
const cachedModels = reactive<Record<string, Model[]>>({});
const loadingTypes = reactive<Record<string, boolean>>({});
const errorTypes = reactive<Record<string, string | null>>({});

export function useModelStore() {
  /**
   * Fetch models for a specific type and update the cache.
   * @param type Model type string (e.g., 'checkpoints', 'others')
   * @param force Invalidate cache and re-fetch from backend
   */
  async function loadModels(type: string, force = false) {
    if (!type) return;
    
    // Skip if already cached and not forcing refresh
    if (cachedModels[type] && !force) {
      return;
    }

    loadingTypes[type] = true;
    errorTypes[type] = null;

    try {
      const models = await fetchModels(type);
      cachedModels[type] = models;
    } catch (e: any) {
      console.error(`Error loading models for type ${type}:`, e);
      errorTypes[type] = e.message || 'Failed to load models';
      // Initialize with empty array on error if not already present
      if (!cachedModels[type]) {
        cachedModels[type] = [];
      }
    } finally {
      loadingTypes[type] = false;
    }
  }

  /**
   * Returns models for a specific type.
   */
  function getModels(type: string) {
    return computed(() => cachedModels[type] || []);
  }

  /**
   * Returns loading status for a specific type.
   */
  function isLoading(type: string) {
    return computed(() => !!loadingTypes[type]);
  }

  /**
   * Returns error status for a specific type.
   */
  function getError(type: string) {
    return computed(() => errorTypes[type] || null);
  }

  return {
    cachedModels,
    loadModels,
    getModels,
    isLoading,
    getError
  };
}
