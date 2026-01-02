import type { DTOStructure, InferDto } from '@schemas/types';
import { assetInsertSchema, assetSelectSchema } from '@tymble/db';
import z from 'zod';

const createAssetDtoSchema = assetInsertSchema
  .omit({
    id: true,
    instrumentId: true,
    averagePrice: true,
    quantity: true,
    fee: true,
  })
  .extend({
    instrumentSymbol: z.string().min(1),
    averagePrice: z.string().optional(),
    quantity: z.string().optional(),
    fee: z.string().optional(),
  });

export const createAssetSchema = {
  dto: createAssetDtoSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type CreateAsset = InferDto<typeof createAssetSchema>;
