import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

const updateUserSchema = userInsertSchema
  .omit({
    emailVerified: true,
    isSuperuser: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
