import type { DTOStructure, InferDto } from '@schemas/types';
import { userUpdateSchema } from '@tymble/db';
import z from 'zod';

export const updateUserSchema = {
  dto: userUpdateSchema
    .omit({
      emailVerifiedAt: true,
      isSuperuser: true,
    })
    .partial(),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type UpdateUser = InferDto<typeof updateUserSchema>;
