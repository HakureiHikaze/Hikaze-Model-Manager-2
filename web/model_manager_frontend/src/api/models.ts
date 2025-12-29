export interface ModelTypesResponse {
  types: string[];
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
