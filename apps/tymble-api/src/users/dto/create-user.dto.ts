import { createLocalUserSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateLocalUserDto extends createZodDto(
  createLocalUserSchema.dto
) {}
