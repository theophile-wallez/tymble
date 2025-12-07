import type { DTOStructure, InferDto } from '@schemas/types';
import { userUpdateSchema } from '@tymble/db';
import z from 'zod';

export const updateUserSchema = {
  dto: userUpdateSchema
    .omit({
      emailVerifiedAt: true,
      isSuperuser: true,
      id: true,
    })
    .partial(),
  res: z.object({}).strict(),
} as const satisfies DTOStructure;

export type UpdateUser = InferDto<typeof updateUserSchema>;
