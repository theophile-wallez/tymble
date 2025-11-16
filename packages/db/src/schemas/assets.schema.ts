import * as d from 'drizzle-orm/pg-core';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../helpers';
import { instrumentTable } from './instrument.schema';
import { portfolioTable } from './portfolio.schema';
import { usersTable } from './users.schema';

/**
 * Assets table.
 *
 * @description
 * This table stores the assets of the users. An asset is a financial instrument held in a portfolio.
 */
export const assetsTable = d.pgTable('assets', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: drizzleRef(usersTable.id, 'cascade'),
  instrumentId: drizzleRef(instrumentTable.id, 'no action'),
  portfolioId: drizzleRef(portfolioTable.id, 'cascade'),
  quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),
  averagePrice: d.numeric({ precision: 18, scale: 18 }).notNull(),
  lastFees: d.numeric({ precision: 18, scale: 18 }).notNull().default('0'),
  lastTaxes: d.numeric({ precision: 18, scale: 8 }).notNull().default('0'),
  ...withTimestamps,
});

export type AssetInsert = typeof assetsTable.$inferInsert;
export type AssetSelect = typeof assetsTable.$inferSelect;

export const assetSelectSchema = zodSelectGenerator(assetsTable);
export const assetInsertSchema = zodInsertGenerator(assetsTable);
