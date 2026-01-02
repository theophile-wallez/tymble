import type { DTOStructure, InferDto } from '@schemas/types';
import {
  assetInsertSchema,
  assetSelectSchema,
  instrumentSelectSchema,
} from '@tymble/db';
import z from 'zod';
import { createInstrumentSchema } from '../instruments';

const createAssetDtoSchema = assetInsertSchema
  .omit({
    id: true,
  })
  .extend({
    averagePrice: assetInsertSchema.shape.averagePrice.optional(),
    quantity: assetInsertSchema.shape.quantity.optional(),
    fee: assetInsertSchema.shape.fee.optional(),
  })
  .and(
    z.discriminatedUnion('instrumentPayloadType', [
      z.object({
        instrumentPayloadType: z.literal('id'),
        instrumentId: instrumentSelectSchema.shape.id,
      }),
      z.object({
        instrumentPayloadType: z.literal('symbol'),
        instrumentSymbol: createInstrumentSchema.dto.shape.symbol,
      }),
    ])
  );

export const createAssetSchema = {
  dto: createAssetDtoSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type CreateAsset = InferDto<typeof createAssetSchema>;
