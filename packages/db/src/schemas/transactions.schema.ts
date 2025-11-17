import { sql } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { transactionSideEnum } from '../enums';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../helpers';

import { instrumentTable } from './instrument.schema';
import { portfoliosTable } from './portfolios.schema';
import { usersTable } from './users.schema';

/**
 * Transaction table.
 *
 * @description
 * This table stores the transactions of the users.
 * A transaction is a purchase or a sale of an asset.
 */

export const transactionTable = d.pgTable(
  'transactions',
  {
    id: d.integer().primaryKey().generatedAlwaysAsIdentity(),

    portfolioId: drizzleRef(portfoliosTable.id),
    assetId: drizzleRef(instrumentTable.id),
    userId: drizzleRef(usersTable.id),

    side: transactionSideEnum('side').notNull(),
    quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),
    price: d.numeric({ precision: 18, scale: 18 }).notNull(),

    fees: d.numeric({ precision: 18, scale: 18 }).notNull().default('0'),
    taxes: d.numeric({ precision: 18, scale: 8 }).notNull().default('0'),

    executedAt: d
      .timestamp('executed_at', { withTimezone: true, mode: 'string' })
      .notNull(),

    note: d.varchar({ length: 255 }),

    ...withTimestamps,
  },
  (table) => {
    return {
      byPortfolioDate: d
        .index('idx_transactions_portfolio_date')
        .on(table.portfolioId, table.executedAt),

      byPortfolioAssetDate: d
        .index('idx_transactions_portfolio_asset_date')
        .on(table.portfolioId, table.assetId, table.executedAt),

      // Guardrails
      qtyPositive: d.check(
        'check_transactions_quantity_positive',
        sql`${table.quantity} > 0`
      ),
      priceNonNegative: d.check(
        'check_transactions_price_non_negative',
        sql`${table.price} >= 0`
      ),
      feesNonNegative: d.check(
        'check_transactions_fees_non_negative',
        sql`${table.fees} >= 0`
      ),
      taxesNonNegative: d.check(
        'check_transactions_taxes_non_negative',
        sql`${table.taxes} >= 0`
      ),
    };
  }
);

export type TransactionInsert = typeof transactionTable.$inferInsert;
export type TransactionSelect = typeof transactionTable.$inferSelect;

export const transactionSelectSchema = zodSelectGenerator(transactionTable);
export const transactionInsertSchema = zodInsertGenerator(transactionTable);
