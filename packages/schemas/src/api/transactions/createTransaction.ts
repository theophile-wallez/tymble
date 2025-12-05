import { transactionInsertSchema } from '@tymble/db';
import type { DTOStructure } from 'types/dto.structure';
import type { InferDto } from 'types/inferDto';
import z from 'zod';

export const createTransactionSchema = {
  dto: transactionInsertSchema,
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type CreateTransaction = InferDto<typeof createTransactionSchema>;
