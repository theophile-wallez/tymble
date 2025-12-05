import { createPortfolioSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreatePortfolioDto extends createZodDto(
  createPortfolioSchema.dto
) {}
