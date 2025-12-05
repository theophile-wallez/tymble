import { getScreenerSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetScreenerQueryDto extends createZodDto(getScreenerSchema.dto) {}
export class GetScreenerResDto extends createZodDto(getScreenerSchema.res) {}
