import z from 'zod';
import type { DTOStructure, InferDto } from '../types';

export const loginSchema = {
  dto: z.object({
    email: z.email(),
    password: z.string(),
  }),
  res: z.object({
    user: z.object({
      id: z.uuid(),
      email: z.email(),
      name: z.string(),
    }),
  }),
} as const satisfies DTOStructure;

export type Login = InferDto<typeof loginSchema>;
