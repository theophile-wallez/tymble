import { sql } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import { transactionSideEnum } from '../enums';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';
import { instrumentTable } from './instruments.schema';

/**
 * Transaction table.
 *
 * @description
 * This table stores the transactions of the users.
 * A transaction is a purchase or a sale of an asset.
 */

export const transactionsTable = d.pgTable(
  'transactions',
  {
    id: d.uuid().primaryKey().defaultRandom(),
    assetId: drizzleRef(instrumentTable.id),

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
  (table) => [
    d.check('check_transactions_quantity_positive', sql`${table.quantity} > 0`),
    d.check('check_transactions_price_non_negative', sql`${table.price} >= 0`),
    d.check('check_transactions_fees_non_negative', sql`${table.fees} >= 0`),
    d.check('check_transactions_taxes_non_negative', sql`${table.taxes} >= 0`),
  ]
);

export const transactionSelectSchema = zodSelectGenerator(
  transactionsTable
).extend({});
export const transactionInsertSchema = zodInsertGenerator(
  transactionsTable
).extend({});
export const transactionUpdateSchema = zodUpdateGenerator(
  transactionsTable
).extend({});

export type TransactionSelect = z.infer<typeof transactionSelectSchema>;
export type TransactionInsert = z.infer<typeof transactionInsertSchema>;
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;
