import { transactionInsertSchema } from '@tymble/db';
import z from 'zod';
import type { DTOStructure, InferDto } from '../types';

export const createTransactionSchema = {
  dto: transactionInsertSchema,
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type CreateTransaction = InferDto<typeof createTransactionSchema>;

export const updateTransactionSchema = {
  dto: createTransactionSchema.dto.partial(),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type UpdateTransaction = InferDto<typeof updateTransactionSchema>;
