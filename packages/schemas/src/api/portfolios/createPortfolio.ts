import type { DTOStructure, InferDto } from '@schemas/types';
import { portfolioInsertSchema, portfolioSelectSchema } from '@tymble/db';

export const createPortfolioSchema = {
  dto: portfolioInsertSchema.omit({
    userId: true,
    id: true,
  }),
  res: portfolioSelectSchema,
} satisfies DTOStructure;

export type CreatePortfolio = InferDto<typeof createPortfolioSchema>;
