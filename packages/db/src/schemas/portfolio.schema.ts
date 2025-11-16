import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '@/helpers';
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
export const portfolioTable = d.pgTable('portfolios', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: d
    .integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  type: d.varchar({ length: 255 }).notNull(),
  provider: d.varchar({ length: 255 }).notNull(),
  description: d.varchar({ length: 255 }),
  ...timestamps,
});

export type PortfolioInsert = typeof portfolioTable.$inferInsert;
export type PortfolioSelect = typeof portfolioTable.$inferSelect;

export const portfolioSelectSchema = createSelectSchema(portfolioTable);
export const portfolioInsertSchema = createInsertSchema(portfolioTable);
