import { reactive, computed, type ComputedRef } from 'vue';
import { fetchModels } from '../api/models';
import type { Model } from '@shared/types/model_record';

type TypeInput = string | ComputedRef<string>;

function resolveType(t: TypeInput): string {
  return typeof t === 'string' ? t : t.value;
}

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
  function getModels(type: TypeInput) {
    return computed(() => cachedModels[resolveType(type)] || []);
  }

  /**
   * Returns loading status for a specific type.
   */
  function isLoading(type: TypeInput) {
    return computed(() => !!loadingTypes[resolveType(type)]);
  }

  /**
   * Returns error status for a specific type.
   */
    function getError(type: TypeInput) {
      return computed(() => errorTypes[resolveType(type)] || null);
    }
  
    return {
      loadModels,
      getModels,
      isLoading,
      getError
    };
  }