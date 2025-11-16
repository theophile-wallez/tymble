import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { drizzleRef, timestamps } from '../helpers';
import { instrumentTable } from './instrument.schema';
import { portfolioTable } from './portfolio.schema';
import { usersTable } from './users.schema';

/**
 * Portfolio table.
 *
 * @description
 * This table stores the portfolios of the users. A portfolio is a collection of stocks.
 * For example, an user can have a Trade Republic portfolio and a Boursobank PEA portfolio.
 * There's no limit to the number of portfolios an user can have.
 * We do not store directly the stocks in the portfolio, but each transaction is linked to an portfolio.
 * A portfolio can be of type PEA, PEE, PEA-PME, CTO, etc.
 * We store the type of the portfolio in the type column.
 */
export const assetsTable = d.pgTable('portfolios', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: drizzleRef(usersTable.id, 'cascade'),
  instrumentId: drizzleRef(instrumentTable.id, 'no action'),
  portfolioId: drizzleRef(portfolioTable.id, 'cascade'),
  quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),
  averagePrice: d.numeric({ precision: 18, scale: 18 }).notNull(),
  ...timestamps,
});

export type AssetInsert = typeof assetsTable.$inferInsert;
export type AssetSelect = typeof assetsTable.$inferSelect;

export const assetSelectSchema = createSelectSchema(assetsTable);
export const assetInsertSchema = createInsertSchema(assetsTable);
