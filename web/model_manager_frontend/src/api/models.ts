import type { 
  ModelTypesResponse, 
  ModelsResponse, 
  TagsResponse, 
  ImageCountResponse 
} from '@shared/types/api';
import type { Model, ModelFull, Tag } from '@shared/types/model_record';

/**
 * Fetch available model types from the backend.
 */
export async function fetchModelTypes(): Promise<string[]> {
  const response = await fetch('/api/models/get_types');
  if (!response.ok) {
    throw new Error(`Failed to fetch model types: ${response.statusText}`);
  }
  const data: ModelTypesResponse = await response.json();
  return data.types;
}

/**
 * Fetch all available tags from the backend.
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags');
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }
  const data: TagsResponse = await response.json();
  return data.tags;
}

/**
 * Add/resolve tags by name.
 */
export async function addTags(names: string[]): Promise<Tag[]> {
  const response = await fetch('/api/tags_add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newtags: names })
  });
  if (!response.ok) {
    throw new Error(`Failed to add tags: ${response.statusText}`);
  }
  const data: TagsResponse = await response.json();
  return data.tags;
}

/**
 * Fetch models of a specific type from the backend.
 */
export async function fetchModels(type: string): Promise<Model[]> {
  const response = await fetch(`/api/models?type=${encodeURIComponent(type)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data: ModelsResponse = await response.json();
  return data.models;
}

/**
 * Fetch full details for a specific model.
 */
export async function fetchModelDetails(sha256: string): Promise<ModelFull> {
  const response = await fetch(`/api/models/${sha256}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch model details: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Update model metadata and tags.
 * Following the "Full Info" rule: Pass the complete ModelFull state.
 */
export async function updateModel(sha256: string, data: ModelFull): Promise<ModelFull> {
  const response = await fetch(`/api/models/${sha256}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Failed to update model: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Fetch image count for a model.
 */
export async function fetchImageCount(sha256: string): Promise<number> {
  const response = await fetch(`/api/images/get_img_count?sha256=${sha256}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image count: ${response.statusText}`);
  }
  const data: ImageCountResponse = await response.json();
  return data.count;
}

/**
 * Delete a specific image sequence.
 */
export async function deleteImage(sha256: string, seq: number): Promise<void> {
  const response = await fetch(`/api/images/delete?sha256=${sha256}&seq=${seq}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Failed to delete image: ${response.statusText}`);
  }
}