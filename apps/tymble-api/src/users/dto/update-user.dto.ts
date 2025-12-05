import { userUpdateSchema } from '@tymble/db';
import { createZodDto } from 'nestjs-zod';

const updateUserSchema = userUpdateSchema
  .omit({
    emailVerifiedAt: true,
    isSuperuser: true,
  })
  .partial();

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
