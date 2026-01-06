import { reactive, computed, type ComputedRef } from 'vue';
import { fetchModels, fetchModelDetails, fetchPendingModels } from '../api/models';
import type {
  Model,
  ModelFull,
  PendingModelSimpleRecord,
  PendingModelRecord
} from '@shared/types/model_record';

type TypeInput = string | ComputedRef<string>;
type Mode = 'active' | 'pending';

function resolveType(t: TypeInput): string {
  return typeof t === 'string' ? t : t.value;
}

function createActiveCache() {
  const cachedModels = reactive<Record<string, Model[]>>({});
  const loadingTypes = reactive<Record<string, boolean>>({});
  const errorTypes = reactive<Record<string, string | null>>({});
  const cachedDetails = reactive<Record<string, ModelFull>>({});
  const loadingDetails = reactive<Record<string, boolean>>({});
  const errorDetails = reactive<Record<string, string | null>>({});

  async function loadModels(type: string, force = false) {
    if (!type) return;
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
      errorTypes[type] = e?.message || 'Failed to load models';
      if (!cachedModels[type]) {
        cachedModels[type] = [];
      }
    } finally {
      loadingTypes[type] = false;
    }
  }

  async function loadDetails(sha256: string, force = false) {
    if (!sha256) return;
    if (cachedDetails[sha256] && !force) {
      return;
    }

    loadingDetails[sha256] = true;
    errorDetails[sha256] = null;

    try {
      const detail = await fetchModelDetails(sha256);
      cachedDetails[sha256] = detail;
      updateListEntry(detail);
    } catch (e: any) {
      console.error(`Error loading model details for ${sha256}:`, e);
      errorDetails[sha256] = e?.message || 'Failed to load model details';
    } finally {
      loadingDetails[sha256] = false;
    }
  }

  function updateListEntry(detail: ModelFull) {
    Object.keys(cachedModels).forEach((type) => {
      const list = cachedModels[type];
      if (!list || list.length === 0) return;
      const index = list.findIndex((item) => item.sha256 === detail.sha256);
      if (index === -1) return;
      const existing = list[index];
      if (!existing) return;
      list[index] = {
        ...existing,
        name: detail.name,
        tags: detail.tags
      };
    });
  }

  function setDetails(detail: ModelFull) {
    cachedDetails[detail.sha256] = detail;
    updateListEntry(detail);
  }

  function getModels(type: TypeInput) {
    return computed(() => cachedModels[resolveType(type)] || []);
  }

  function isLoading(type: TypeInput) {
    return computed(() => !!loadingTypes[resolveType(type)]);
  }

  function getError(type: TypeInput) {
    return computed(() => errorTypes[resolveType(type)] || null);
  }

  function getDetails(sha256: string) {
    return computed(() => cachedDetails[sha256] || null);
  }

  function isDetailsLoading(sha256: string) {
    return computed(() => !!loadingDetails[sha256]);
  }

  function getDetailsError(sha256: string) {
    return computed(() => errorDetails[sha256] || null);
  }

  function reset() {
    Object.keys(cachedModels).forEach((key) => delete cachedModels[key]);
    Object.keys(loadingTypes).forEach((key) => delete loadingTypes[key]);
    Object.keys(errorTypes).forEach((key) => delete errorTypes[key]);
    Object.keys(cachedDetails).forEach((key) => delete cachedDetails[key]);
    Object.keys(loadingDetails).forEach((key) => delete loadingDetails[key]);
    Object.keys(errorDetails).forEach((key) => delete errorDetails[key]);
  }

  function invalidate(type?: string) {
    if (!type) {
      reset();
      return;
    }
    delete cachedModels[type];
    delete loadingTypes[type];
    delete errorTypes[type];
  }

  return {
    loadModels,
    loadDetails,
    setDetails,
    getModels,
    isLoading,
    getError,
    getDetails,
    isDetailsLoading,
    getDetailsError,
    reset,
    invalidate
  };
}

function createPendingCache() {
  const cachedModels = reactive<Record<string, PendingModelSimpleRecord[]>>({});
  const loadingTypes = reactive<Record<string, boolean>>({});
  const errorTypes = reactive<Record<string, string | null>>({});

  async function loadModels(type: string, force = false) {
    const key = type || 'pending';
    if (cachedModels[key] && !force) {
      return;
    }

    loadingTypes[key] = true;
    errorTypes[key] = null;

    try {
      cachedModels[key] = await fetchPendingModels();
    } catch (e: any) {
      console.error('Error loading pending models:', e);
      errorTypes[key] = e?.message || 'Failed to load pending models';
      if (!cachedModels[key]) {
        cachedModels[key] = [];
      }
    } finally {
      loadingTypes[key] = false;
    }
  }

  function getModels(type: TypeInput) {
    const key = resolveType(type) || 'pending';
    return computed(() => cachedModels[key] || []);
  }

  function isLoading(type: TypeInput) {
    const key = resolveType(type) || 'pending';
    return computed(() => !!loadingTypes[key]);
  }

  function getError(type: TypeInput) {
    const key = resolveType(type) || 'pending';
    return computed(() => errorTypes[key] || null);
  }

  function reset() {
    Object.keys(cachedModels).forEach((key) => delete cachedModels[key]);
    Object.keys(loadingTypes).forEach((key) => delete loadingTypes[key]);
    Object.keys(errorTypes).forEach((key) => delete errorTypes[key]);
  }

  function invalidate(type?: string) {
    if (!type) {
      reset();
      return;
    }
    delete cachedModels[type];
    delete loadingTypes[type];
    delete errorTypes[type];
  }

  return {
    loadModels,
    getModels,
    isLoading,
    getError,
    reset,
    invalidate,
    // Placeholder signatures for parity with active cache.
    loadDetails: async (_id: string, _force = false) => {},
    setDetails: (_detail: PendingModelRecord) => {},
    getDetails: (_id: string) => computed(() => null),
    isDetailsLoading: (_id: string) => computed(() => false),
    getDetailsError: (_id: string) => computed(() => null)
  };
}

const activeCache = createActiveCache();
const pendingCache = createPendingCache();

type ActiveCache = ReturnType<typeof createActiveCache>;
type PendingCache = ReturnType<typeof createPendingCache>;

export function useModelCache(mode: 'pending'): PendingCache;
export function useModelCache(mode?: 'active'): ActiveCache;
export function useModelCache(mode: Mode = 'active') {
  return mode === 'pending' ? pendingCache : activeCache;
}

export function resetModelCaches() {
  activeCache.reset();
  pendingCache.reset();
}
