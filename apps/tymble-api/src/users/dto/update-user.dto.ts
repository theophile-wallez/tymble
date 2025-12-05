import { updateUserSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserDto extends createZodDto(updateUserSchema.dto) {}
