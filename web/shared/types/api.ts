import type { Model } from './model_record';
import type { Tag } from './common';

export interface ModelTypesResponse {
  types: string[];
}

export interface ModelsResponse {
  models: Model[];
}

export interface TagsResponse {
  tags: Tag[];
}

export interface ImageCountResponse {
  count: number;
}
