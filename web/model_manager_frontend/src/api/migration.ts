import type { Tag } from './models';

export interface PendingModel {
  id: number;
  path: string;
  sha256?: string;
  name?: string;
  type?: string;
  size_bytes?: number;
  created_at?: number;
  meta_json?: string;
  tags?: Tag[];
}

export interface PendingModelsResponse {
  models: PendingModel[];
}

export interface PendingCountResponse {
  count: number;
}

/**
 * Fetch total count of pending models from the backend.
 */
export async function fetchPendingCount(): Promise<number> {
  const response = await fetch('/api/migration/get_pending_count');
  if (!response.ok) {
    throw new Error(`Failed to fetch pending count: ${response.statusText}`);
  }
  const data: PendingCountResponse = await response.json();
  return data.count;
}

/**
 * Fetch pending models, optionally filtered by type.
 */
export async function fetchPendingModels(type?: string): Promise<PendingModel[]> {
  let url = '/api/migration/get_pending_models';
  if (type) {
    url += `?type=${encodeURIComponent(type)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch pending models: ${response.statusText}`);
  }
  const data: PendingModelsResponse = await response.json();
  return data.models;
}

/**
 * Fetch full details for a specific pending model.
 */
export async function fetchPendingModel(id: number): Promise<PendingModel> {
  const response = await fetch(`/api/migration/get_pending_model?id=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pending model details: ${response.statusText}`);
  }
  return await response.json();
}
