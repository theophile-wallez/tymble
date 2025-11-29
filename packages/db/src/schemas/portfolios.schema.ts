import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';
import { iconsTable } from './misc/icons.schema';
import { usersTable } from './users/users.schema';

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
    id: d.uuid().primaryKey().defaultRandom(),
    userId: drizzleRef(usersTable.id, 'cascade'),
    type: d.varchar({ length: 255 }).notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    description: d.varchar({ length: 255 }),
    name: d.varchar({ length: 50 }).notNull(),
    iconId: drizzleRef(iconsTable.id),

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

export const portfolioSelectSchema = zodSelectGenerator(portfoliosTable);
export const portfolioInsertSchema = zodInsertGenerator(portfoliosTable);
export const portfolioUpdateSchema = zodUpdateGenerator(portfoliosTable);

export type PortfolioSelect = z.infer<typeof portfolioSelectSchema>;
export type PortfolioInsert = z.infer<typeof portfolioInsertSchema>;
export type PortfolioUpdate = z.infer<typeof portfolioUpdateSchema>;
