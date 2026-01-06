import { reactive, computed } from 'vue';
import { fetchTags } from '../api/models';
import type { Tag } from '@shared/types/model_record';

const state = reactive({
  items: [] as Tag[],
  loading: false,
  error: null as string | null,
  loaded: false
});

async function loadTags(force = false) {
  if (state.loaded && !force) return;
  state.loading = true;
  state.error = null;

  try {
    const tags = await fetchTags();
    state.items = [...tags];
    state.loaded = true;
  } catch (e: any) {
    console.error('Error loading tags:', e);
    state.error = e?.message || 'Failed to load tags';
    state.items = [];
    state.loaded = false;
  } finally {
    state.loading = false;
  }
}

function mergeTags(tags: Tag[]) {
  if (!tags.length) return;
  const byId = new Map(state.items.map((t) => [t.id, t]));
  tags.forEach((tag) => {
    if (!byId.has(tag.id)) {
      byId.set(tag.id, tag);
    }
  });
  state.items = Array.from(byId.values());
}

function resetTags() {
  state.items = [];
  state.loaded = false;
  state.error = null;
  state.loading = false;
}

export function useTagsCache() {
  return {
    loadTags,
    mergeTags,
    resetTags,
    getTags: () => computed(() => state.items),
    isLoading: () => computed(() => state.loading),
    getError: () => computed(() => state.error)
  };
}
