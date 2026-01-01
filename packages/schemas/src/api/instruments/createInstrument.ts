import type { DTOStructure, InferDto } from '@schemas/types';
import { instrumentInsertSchema, instrumentSelectSchema } from '@tymble/db';

export const createInstrumentSchema = {
  dto: instrumentInsertSchema.omit({
    id: true,
  }),
  res: instrumentSelectSchema,
} satisfies DTOStructure;

export type CreateInstrument = InferDto<typeof createInstrumentSchema>;
