import { updatePortfolioSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdatePortfolioDto extends createZodDto(
  updatePortfolioSchema.dto
) {}
