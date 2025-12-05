import { userUpdateSchema } from '@tymble/db';
import type { DTOStructure } from 'types/dto.structure';
import type { InferDto } from 'types/inferDto';
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
