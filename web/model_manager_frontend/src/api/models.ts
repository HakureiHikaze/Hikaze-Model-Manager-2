import type { 
  ModelTypesResponse, 
  ModelsResponse, 
  TagsResponse, 
  ImageCountResponse,
  PendingModelsResponse,
  MigrationReport,
  BatchPromotionReport
} from '@shared/types/api';
import type { Model, ModelFull, Tag, PendingModelSimpleRecord } from '@shared/types/model_record';
import { adaptModelSimpleRecord, adaptModelRecord, adaptPendingModelSimpleRecord } from '@shared/adapters/models';
import { adaptTag } from '@shared/adapters/tags';
import { buildApiUrl } from '@shared/util/sniffer_port';

async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const url = await buildApiUrl(path);
  return fetch(url, init);
}

/**
 * Fetch available model types from the backend.
 */
export async function fetchModelTypes(): Promise<string[]> {
  const response = await fetchApi('/api/models/get_types');
  if (!response.ok) {
    throw new Error(`Failed to fetch model types: ${response.statusText}`);
  }
  const data: ModelTypesResponse = await response.json();
  return (data.types || []).map(t => String(t));
}

/**
 * Fetch all available tags from the backend.
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await fetchApi('/api/tags');
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }
  const data: TagsResponse = await response.json();
  return (data.tags || []).map(adaptTag);
}

/**
 * Add/resolve tags by name.
 */
export async function addTags(names: string[]): Promise<Tag[]> {
  const response = await fetchApi('/api/tags_add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newtags: names })
  });
  if (!response.ok) {
    throw new Error(`Failed to add tags: ${response.statusText}`);
  }
  const data: TagsResponse = await response.json();
  return (data.tags || []).map(adaptTag);
}

/**
 * Fetch models of a specific type from the backend.
 */
export async function fetchModels(type: string): Promise<Model[]> {
  const response = await fetchApi(`/api/models?type=${encodeURIComponent(type)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data: ModelsResponse = await response.json();
  return (data.models || []).map(adaptModelSimpleRecord);
}

/**
 * Fetch full details for a specific model.
 */
export async function fetchModelDetails(sha256: string): Promise<ModelFull> {
  const response = await fetchApi(`/api/models/${sha256}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch model details: ${response.statusText}`);
  }
  const data = await response.json();
  return adaptModelRecord(data);
}

/**
 * Update model metadata and tags.
 * Following the "Full Info" rule: Pass the complete ModelFull state.
 */
export async function updateModel(sha256: string, data: ModelFull): Promise<ModelFull> {
  const response = await fetchApi(`/api/models/${sha256}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Failed to update model: ${response.statusText}`);
  }
  const result = await response.json();
  return adaptModelRecord(result);
}

/**
 * Fetch image count for a model.
 */
export async function fetchImageCount(sha256: string): Promise<number> {
  const response = await fetchApi(`/api/images/get_img_count?sha256=${sha256}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image count: ${response.statusText}`);
  }
  const data: ImageCountResponse = await response.json();
  return Number(data.count ?? 0);
}

/**
 * Delete a specific image sequence.
 */
export async function deleteImage(sha256: string, seq: number): Promise<void> {
  const response = await fetchApi(`/api/images/delete?sha256=${sha256}&seq=${seq}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Failed to delete image: ${response.statusText}`);
  }
}

/**
 * Stage 1: Migrate legacy DB.
 */
export async function migrateLegacyDb(legacyDbPath: string, legacyImagesDir?: string): Promise<MigrationReport> {
  const response = await fetchApi('/api/migration/migrate_legacy_db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ legacy_db_path: legacyDbPath, legacy_images_dir: legacyImagesDir })
  });
  if (!response.ok) {
    throw new Error(`Failed to migrate legacy DB: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * GET list of pending models.
 */
export async function fetchPendingModels(): Promise<PendingModelSimpleRecord[]> {
  const response = await fetchApi('/api/migration/pending_models');
  if (!response.ok) {
    throw new Error(`Failed to fetch pending models: ${response.statusText}`);
  }
  const data: PendingModelsResponse = await response.json();
  return (data.models || []).map(adaptPendingModelSimpleRecord);
}

/**
 * Promote pending models to active.
 */
export async function importModels(ids: number[], conflictStrategy: 'override' | 'merge' | 'ignore' | 'delete' | null): Promise<BatchPromotionReport> {
  const response = await fetchApi('/api/migration/import_models', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ids, conflict_strategy: conflictStrategy })
  });
  if (!response.ok) {
    throw new Error(`Failed to import models: ${response.statusText}`);
  }
  return await response.json();
}
