import { updateTransactionSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateTransactionDto extends createZodDto(
  updateTransactionSchema.dto
) {}
