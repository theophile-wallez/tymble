import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../helpers';
import { assetsTable } from './assets.schema';
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
export const portfoliosTable = d.pgTable(
  'portfolios',
  {
    id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: drizzleRef(usersTable.id, 'cascade'),
    type: d.varchar({ length: 255 }).notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    description: d.varchar({ length: 255 }),
    name: d.varchar({ length: 50 }).notNull(),
    emoji: d.varchar({ length: 10 }),

    ...withTimestamps,
  },
  (table) => ({
    /**
     * Unique constraint on userId and name to ensure a user cannot have two portfolios with the same name
     */
    userNameUnique: d
      .uniqueIndex('uq_portfolios_user_name')
      .on(table.userId, table.name),
  })
);

export const portfoliosRelations = relations(
  portfoliosTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [portfoliosTable.userId],
      references: [usersTable.id],
    }),
    assets: many(assetsTable),
  })
);

export type PortfolioInsert = typeof portfoliosTable.$inferInsert;
export type PortfolioSelect = typeof portfoliosTable.$inferSelect;

export const portfolioSelectSchema = zodSelectGenerator(portfoliosTable);
export const portfolioInsertSchema = zodInsertGenerator(portfoliosTable);
