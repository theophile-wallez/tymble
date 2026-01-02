import type { DTOStructure, InferDto } from '@schemas/types';
import { assetSelectSchema, assetUpdateSchema } from '@tymble/db';

export const updateAssetSchema = {
  dto: assetUpdateSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type UpdateAsset = InferDto<typeof updateAssetSchema>;
