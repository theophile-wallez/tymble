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
  .and(
    z.discriminatedUnion('instrumentPayloadType', [
      z.object({
        instrumentPayloadType: z.literal('id'),
        instrumentId: instrumentSelectSchema.shape.id,
      }),
      z
        .object({
          instrumentPayloadType: z.literal('dto'),
        })
        .extend({
          instrument: createInstrumentSchema.dto,
        }),
    ])
  );

export const createAssetSchema = {
  dto: createAssetDtoSchema,
  res: assetSelectSchema,
} satisfies DTOStructure;

export type CreateAsset = InferDto<typeof createAssetSchema>;
