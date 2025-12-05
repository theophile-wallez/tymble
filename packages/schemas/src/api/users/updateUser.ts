import { userUpdateSchema } from '@tymble/db';
import z from 'zod';
import type { DTOStructure, InferDto } from '@/types';

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
