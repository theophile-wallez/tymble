import type { DTOStructure, InferDto } from '@schemas/types';
import { assetInsertSchema, assetSelectSchema } from '@tymble/db';
import z from 'zod';
import { createInstrumentSchema } from '../instruments';

const assetPayloadSchema = assetInsertSchema
  .omit({
    id: true,
  })
  .extend({
    quantity: assetInsertSchema.shape.quantity.optional(),
    averagePrice: assetInsertSchema.shape.averagePrice.optional(),
    fee: assetInsertSchema.shape.fee.optional(),
  });

const createAssetDtoSchema = assetPayloadSchema.or(
  assetPayloadSchema
    .omit({
      instrumentId: true,
    })
    .and(
      z.discriminatedUnion('instrumentPayloadType', [
        z.object({
          instrumentPayloadType: z.literal('id'),
          instrumentSymbol: z.uuid(),
        }),
        z
          .object({
            instrumentPayloadType: z.literal('new'),
          })
          .extend({
            instrument: createInstrumentSchema.dto,
          }),
      ])
    )
);

export const createAssetSchema = {
  dto: createAssetDtoSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type CreateAsset = InferDto<typeof createAssetSchema>;
