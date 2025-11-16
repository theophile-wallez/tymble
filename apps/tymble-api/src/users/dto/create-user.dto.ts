import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = userInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  emailVerified: true,
  isSuperuser: true,
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
