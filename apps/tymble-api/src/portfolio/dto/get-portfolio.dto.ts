import { getPortfolioSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetPortfolioDto extends createZodDto(getPortfolioSchema.dto) {}

export class GetPortfolioResponseDto extends createZodDto(
  getPortfolioSchema.res
) {}
