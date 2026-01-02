import { userInsertSchema, userUpdateSchema } from '@tymble/db';
import z from 'zod';
import { passwordSchema } from '../misc';
import type { DTOStructure, InferDto } from '../types';

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
