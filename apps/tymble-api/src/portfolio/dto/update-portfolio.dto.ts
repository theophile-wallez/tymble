import { portfolioUpdateSchema } from '@tymble/db';
import { createZodDto } from 'nestjs-zod';

export class UpdatePortfolioDto extends createZodDto(portfolioUpdateSchema) {}
