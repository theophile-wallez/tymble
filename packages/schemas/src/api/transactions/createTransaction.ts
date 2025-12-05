import type { DTOStructure, InferDto } from '@schemas/types';
import { transactionInsertSchema } from '@tymble/db';
import z from 'zod';

export const createTransactionSchema = {
  dto: transactionInsertSchema,
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type CreateTransaction = InferDto<typeof createTransactionSchema>;
