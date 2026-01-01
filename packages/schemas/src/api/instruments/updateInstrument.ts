import type { DTOStructure, InferDto } from '@schemas/types';
import { instrumentSelectSchema, instrumentUpdateSchema } from '@tymble/db';

export const updateInstrumentSchema = {
  dto: instrumentUpdateSchema.omit({
    id: true,
  }),
  res: instrumentSelectSchema,
} satisfies DTOStructure;

export type UpdateInstrument = InferDto<typeof updateInstrumentSchema>;
