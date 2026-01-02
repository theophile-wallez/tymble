import {
  portfolioInsertSchema,
  portfolioSelectSchema,
  portfolioUpdateSchema,
} from '@tymble/db';
import z from 'zod';
import type { DTOStructure, InferDto } from '../types';

export const createPortfolioSchema = {
  dto: portfolioInsertSchema.omit({
    userId: true,
    id: true,
  }),
  res: portfolioSelectSchema,
} satisfies DTOStructure;

export type CreatePortfolio = InferDto<typeof createPortfolioSchema>;

export const updatePortfolioSchema = {
  dto: portfolioUpdateSchema,
  res: portfolioSelectSchema,
} satisfies DTOStructure;

export type UpdatePortfolio = InferDto<typeof updatePortfolioSchema>;

export const deletePortfolioSchema = {
  dto: z.object({ id: z.string() }),
  res: z.object({ id: z.string() }),
} satisfies DTOStructure;

export type DeletePortfolio = InferDto<typeof deletePortfolioSchema>;
