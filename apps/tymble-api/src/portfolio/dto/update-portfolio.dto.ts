import { portfolioUpdateSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export class UpdatePortfolioDto extends createZodDto(portfolioUpdateSchema) {}
