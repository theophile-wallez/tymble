import { GetScreenerSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetScreenerQueryDto extends createZodDto(GetScreenerSchema.dto) {}
export class GetScreenerResDto extends createZodDto(GetScreenerSchema.res) {}
