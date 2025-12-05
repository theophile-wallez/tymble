import type { DTOStructure } from 'types/dto.structure';
import z from 'zod';
import { createTransactionSchema } from './createTransaction';

export const updateTransactionSchema = {
  dto: createTransactionSchema.dto.partial(),
  res: z.object({}).strict(),
} satisfies DTOStructure;
