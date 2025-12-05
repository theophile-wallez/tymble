import type { DTOStructure, InferDto } from '@schemas/types';
import { portfolioUpdateSchema } from '@tymble/db';
import z from 'zod';

export const updatePortfolioSchema = {
  dto: portfolioUpdateSchema,
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type UpdatePortfolio = InferDto<typeof updatePortfolioSchema>;
