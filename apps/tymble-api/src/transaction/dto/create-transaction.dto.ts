import { transactionInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export const createTransactionSchema = transactionInsertSchema;

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema
) {}
