import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createUserSchema = userInsertSchema
  .omit({
    emailVerified: true,
    isSuperuser: true,
  })
  .extend({
    password: z.string().min(8).max(128).describe('User password'),
  });

export class CreateUserDto extends createZodDto(createUserSchema) {}
