import type { DTOStructure, InferDto } from '@schemas/types';
import z from 'zod';
import { createTransactionSchema } from './createTransaction';

export const updateTransactionSchema = {
  dto: createTransactionSchema.dto.partial(),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type UpdateTransaction = InferDto<typeof updateTransactionSchema>;
