import {
  assetInsertSchema,
  assetSelectSchema,
  assetUpdateSchema,
  instrumentSelectSchema,
  transactionSelectSchema,
} from '@tymble/db';
import type z from 'zod';
import type { DTOStructure, InferDto } from '../types';

export type Asset = z.infer<typeof assetSelectSchema>;

const assetWithRelationsSchema = assetSelectSchema.extend({
  instrument: instrumentSelectSchema,
  transactions: transactionSelectSchema.array(),
});

export type AssetWithRelations = z.infer<typeof assetWithRelationsSchema>;

const createAssetDtoSchema = assetInsertSchema.omit({
  id: true,
  averagePrice: true,
  quantity: true,
});

export const createAssetSchema = {
  dto: createAssetDtoSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type CreateAsset = InferDto<typeof createAssetSchema>;

export const updateAssetSchema = {
  dto: assetUpdateSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type UpdateAsset = InferDto<typeof updateAssetSchema>;
