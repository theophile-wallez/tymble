import type { DTOStructure, InferDto } from '@schemas/types';
import { portfolioInsertSchema } from '@tymble/db';
import z from 'zod';

export const createPortfolioSchema = {
  dto: portfolioInsertSchema.omit({
    userId: true,
    id: true,
  }),
  res: z.object({}).strict(),
} satisfies DTOStructure;

export type CreatePortfolio = InferDto<typeof createPortfolioSchema>;
