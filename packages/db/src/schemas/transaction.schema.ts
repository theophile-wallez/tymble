import { sql } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../helpers/timestamps.helpers';
import { portfolioTable } from './portfolio.schema';

/**
 * Transaction table.
 *
 * @description
 * This table stores the transactions of the users.
 * A transaction is a purchase or a sale of an asset.
 */

const transactionSide = d.pgEnum('transaction_side', ['buy', 'sell']);

export const transactionTable = d.pgTable(
  'transactions',
  {
    id: d.integer().primaryKey().generatedAlwaysAsIdentity(),

    portfolioId: d
      .integer()
      .notNull()
      .references(() => portfolioTable.id, { onDelete: 'cascade' }),

    side: transactionSide('side').notNull(),

    // Consider replacing with instrumentId -> instruments.id (FK)
    symbol: d.varchar({ length: 64 }).notNull(),
    quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),

    price: d.numeric({ precision: 18, scale: 18 }).notNull(),

    fees: d.numeric({ precision: 18, scale: 18 }).notNull().default('0'),

    taxes: d.numeric({ precision: 18, scale: 8 }).notNull().default('0'),

    executedAt: d.timestamp('executed_at', { withTimezone: true }).notNull(),
    settledAt: d.timestamp('settled_at', { withTimezone: true }),

    note: d.varchar({ length: 255 }),

    ...timestamps,
  },
  (table) => {
    return {
      byPortfolioDate: d
        .index('idx_transactions_portfolio_date')
        .on(table.portfolioId, table.executedAt),

      byPortfolioSymbolDate: d
        .index('idx_transactions_portfolio_symbol_date')
        .on(table.portfolioId, table.symbol, table.executedAt),

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

export const transactionSelectSchema = createSelectSchema(transactionTable);
export const transactionInsertSchema = createInsertSchema(transactionTable);
