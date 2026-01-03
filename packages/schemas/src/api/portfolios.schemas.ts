import {
  assetSelectSchema,
  instrumentSelectSchema,
  portfolioInsertSchema,
  portfolioSelectSchema,
  portfolioUpdateSchema,
} from '@tymble/db';
import z from 'zod';
import type { DTOStructure, InferDto } from '../types';

const portfolioWithSimpleRelationsSchema = portfolioSelectSchema.extend({
  assetsCount: z.number(),
});

export type PortfolioWithSimpleRelations = z.infer<
  typeof portfolioWithSimpleRelationsSchema
>;

export const getPortfoliosSchema = {
  dto: z.undefined(),
  res: portfolioWithSimpleRelationsSchema.array(),
} satisfies DTOStructure;

export type GetPortfolios = InferDto<typeof getPortfoliosSchema>;

// Get single rich portfolio
const portfolioWithRelationsSchema = portfolioSelectSchema.extend({
  assets: z.array(
    assetSelectSchema
      .extend({
        instrument: instrumentSelectSchema,
      })
      .omit({
        instrumentId: true,
      })
  ),
});

export type PortfolioWithRelations = z.infer<
  typeof portfolioWithRelationsSchema
>;

export const getPortfolioSchema = {
  dto: z.object({ id: z.string() }),
  res: portfolioWithRelationsSchema,
} satisfies DTOStructure;

export type GetPortfolio = InferDto<typeof getPortfolioSchema>;

// Create a new portfolio

export const createPortfolioSchema = {
  dto: portfolioInsertSchema.omit({
    userId: true,
    id: true,
  }),
  res: portfolioSelectSchema,
} satisfies DTOStructure;

export type CreatePortfolio = InferDto<typeof createPortfolioSchema>;

// Update a portfolio

export const updatePortfolioSchema = {
  dto: portfolioUpdateSchema,
  res: portfolioSelectSchema,
} satisfies DTOStructure;

export type UpdatePortfolio = InferDto<typeof updatePortfolioSchema>;

// Delete a portfolio

export const deletePortfolioSchema = {
  dto: z.object({ id: z.string() }),
  res: z.object({ id: z.string() }),
} satisfies DTOStructure;

export type DeletePortfolio = InferDto<typeof deletePortfolioSchema>;
