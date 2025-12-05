import { createTransactionSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema.dto
) {}
