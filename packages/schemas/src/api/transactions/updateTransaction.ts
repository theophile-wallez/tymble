import z from 'zod';
import type { DTOStructure, InferDto } from '@/types';
import { createTransactionSchema } from './createTransaction';

export const updateTransactionSchema = {
  dto: createTransactionSchema.dto.partial(),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type UpdateTransaction = InferDto<typeof updateTransactionSchema>;
