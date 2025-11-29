import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';
import { instrumentTable } from './instruments.schema';
import { portfoliosTable } from './portfolios.schema';

/**
 * Assets table.
 *
 * @description
 * This table stores the assets of the users. An asset is a financial instrument held in a portfolio.
 */
export const assetsTable = d.pgTable('assets', {
  id: d.uuid().primaryKey().defaultRandom(),
  instrumentId: drizzleRef(instrumentTable.id, 'no action'),
  portfolioId: drizzleRef(portfoliosTable.id, 'cascade'),
  quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),
  averagePrice: d.numeric({ precision: 18, scale: 18 }).notNull(),
  lastFees: d.numeric({ precision: 18, scale: 18 }).notNull().default('0'),
  lastTaxes: d.numeric({ precision: 18, scale: 8 }).notNull().default('0'),
  ...withTimestamps,
});

export const assetSelectSchema = zodSelectGenerator(assetsTable);
export const assetInsertSchema = zodInsertGenerator(assetsTable);
export const assetUpdateSchema = zodUpdateGenerator(assetsTable);

export type AssetSelect = z.infer<typeof assetSelectSchema>;
export type AssetInsert = z.infer<typeof assetInsertSchema>;
export type AssetUpdate = z.infer<typeof assetUpdateSchema>;
