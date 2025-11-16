import { createZodDto } from 'nestjs-zod';
import { createPortfolioSchema } from './create-portfolio.dto';

const updatePortfolioSchema = createPortfolioSchema.partial();

export class UpdatePortfolioDto extends createZodDto(updatePortfolioSchema) {}
