import { getPortfoliosSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetUserPortfoliosResponseDto extends createZodDto(
  getPortfoliosSchema.res
) {}
