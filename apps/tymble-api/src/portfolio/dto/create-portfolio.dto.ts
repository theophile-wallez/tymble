import { portfolioInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

const createPortfolioDtoSchema = portfolioInsertSchema.omit({
  userId: true,
  id: true,
});

export class CreatePortfolioDto extends createZodDto(
  createPortfolioDtoSchema
) {}
