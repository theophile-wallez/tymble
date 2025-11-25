import { portfolioInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export class CreatePortfolioDto extends createZodDto(portfolioInsertSchema) {}
