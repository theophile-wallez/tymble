import { portfolioInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export const createPortfolioSchema = portfolioInsertSchema;

export class CreatePortfolioDto extends createZodDto(createPortfolioSchema) {}
