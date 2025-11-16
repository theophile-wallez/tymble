import { portfolioInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export const createPortfolioSchema = portfolioInsertSchema.omit({
  id: true,
});

export class CreatePortfolioDto extends createZodDto(createPortfolioSchema) {}
