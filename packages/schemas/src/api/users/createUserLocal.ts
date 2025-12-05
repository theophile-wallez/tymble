import { userInsertSchema } from '@tymble/db';
import type { DTOStructure } from 'types/dto.structure';
import type { InferDto } from 'types/inferDto';
import z from 'zod';
import { passwordSchema } from '../../misc';

export const createLocalUserSchema = {
  dto: userInsertSchema
    .omit({
      emailVerifiedAt: true,
      isSuperuser: true,
    })
    .extend({
      password: passwordSchema,
      passwordConfirmation: passwordSchema,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.passwordConfirmation) {
        ctx.addIssue({
          code: 'custom',
          message: 'passwords do not match',
        });
      }
    }),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type CreateUserLocal = InferDto<typeof createLocalUserSchema>;
