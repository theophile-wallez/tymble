import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const passwordSchema = z
  .string()
  .min(12, 'must be at least 12 characters long')
  .regex(/[a-z]/, 'must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'must contain at least one uppercase letter')
  .regex(/[0-9]/, 'must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'must contain at least one special character');

export const createLocalUserSchema = userInsertSchema
  .omit({
    emailVerifiedAt: true,
    isSuperuser: true,
  })
  .extend({
    password: passwordSchema,
  });

export class CreateLocalUserDto extends createZodDto(createLocalUserSchema) {}
