import { userUpdateSchema } from '@tymble/db';
import type { DTOStructure } from 'types/dto.structure';
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
