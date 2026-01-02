import type { DTOStructure } from '@schemas/types';
import { instrumentSelectSchema } from '@tymble/db';
import z from 'zod';

export const searchInstrumentSchema = {
  dto: z.object({
    query: z.string(),
  }),
  res: z.object({
    instruments: z.array(instrumentSelectSchema),
  }),
} satisfies DTOStructure;
