import type { Model, PendingModelSimpleRecord } from './model_record';
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

export interface PendingModelsResponse {
  models: PendingModelSimpleRecord[];
}

export interface MigrationReport {
  status: 'success' | 'failed';
  db_migration: {
    migrated: number;
    pending: number;
    errors: number;
    images_processed: number;
    image_errors: number;
  };
}

export interface BatchPromotionReport {
  total: number;
  success: number[];
  conflict: Array<{
    pending: { id: number; path: string };
    existing: { id: string; path: string };
  }>;
  ignored: number[];
  deleted: number[];
  failed: Array<{ id: number; error: string }>;
}
