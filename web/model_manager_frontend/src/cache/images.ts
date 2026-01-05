import { reactive, computed } from 'vue';
import { fetchImageCount } from '../api/models';
import { getApiBaseSync } from '@shared/util/sniffer_port';

const counts = reactive<Record<string, number>>({});
const loading = reactive<Record<string, boolean>>({});
const errors = reactive<Record<string, string | null>>({});
const revisions = reactive<Record<string, number>>({});

function bumpRevision(sha256: string) {
  revisions[sha256] = (revisions[sha256] ?? 0) + 1;
}

function resetImageCache(sha256?: string) {
  if (sha256) {
    delete counts[sha256];
    delete loading[sha256];
    delete errors[sha256];
    delete revisions[sha256];
    return;
  }
  Object.keys(counts).forEach((key) => delete counts[key]);
  Object.keys(loading).forEach((key) => delete loading[key]);
  Object.keys(errors).forEach((key) => delete errors[key]);
  Object.keys(revisions).forEach((key) => delete revisions[key]);
}

async function loadImageCount(sha256: string, force = false) {
  if (!sha256) return;
  if (counts[sha256] != null && !force) return;

  loading[sha256] = true;
  errors[sha256] = null;

  try {
    counts[sha256] = await fetchImageCount(sha256);
  } catch (e: any) {
    console.error(`Error loading image count for ${sha256}:`, e);
    errors[sha256] = e?.message || 'Failed to load image count';
    counts[sha256] = 0;
  } finally {
    loading[sha256] = false;
  }
}

function getImageUrl(sha256: string, seq: number, quality: 'high' | 'medium' | 'low' = 'high') {
  const revision = revisions[sha256] ?? 0;
  const base = getApiBaseSync();
  const prefix = base ? `${base}` : '';
  return `${prefix}/api/images/${sha256}_${seq}.webp?quality=${quality}&rev=${revision}`;
}

export function useImageCache() {
  return {
    loadImageCount,
    bumpRevision,
    resetImageCache,
    getImageUrl,
    getImageCount: (sha256: string) => computed(() => counts[sha256] ?? 0),
    isLoading: (sha256: string) => computed(() => !!loading[sha256]),
    getError: (sha256: string) => computed(() => errors[sha256] ?? null)
  };
}
