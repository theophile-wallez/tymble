import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = userInsertSchema.omit({
  emailVerified: true,
  isSuperuser: true,
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
