export interface ModelTypesResponse {
  types: string[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface Model {
  sha256: string;
  name: string;
  type: string;
  path: string;
  size_bytes: number;
  created_at: number;
  tags: Tag[];
}

export interface ModelsResponse {
  models: Model[];
}

export interface TagsResponse {
  tags: Tag[];
}

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
 * Fetch models of a specific type from the backend.
 */
export async function fetchModels(type: string): Promise<Model[]> {
  const response = await fetch('/api/models/get_types');
  if (!response.ok) {
    throw new Error(`Failed to fetch model types: ${response.statusText}`);
  }
  const data: ModelTypesResponse = await response.json();
  return data.types;
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
