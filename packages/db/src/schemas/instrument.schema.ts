import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../helpers/timestamps.helpers';

/**
 * Instrument table.
 *
 * @description
 * This table stores the financial instruments available in the application.
 * Each instrument has a symbol, name, and type (e.g. stock, bond, ETF).
 */

const instrumentType = d.pgEnum('instrument_type', [
  'stock',
  'bond',
  'etf',
  'crypto',
]);

export const instrumentTable = d.pgTable('instruments', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  symbol: d.varchar({ length: 64 }).notNull().unique(),
  name: d.varchar({ length: 255 }).notNull(),
  type: instrumentType('type').notNull(),
  exchange: d.varchar({ length: 100 }),
  currency: d.varchar({ length: 10 }),
  ...timestamps,
});

export type InstrumentInsert = typeof instrumentTable.$inferInsert;
export type InstrumentSelect = typeof instrumentTable.$inferSelect;

export const instrumentSelectSchema = createSelectSchema(instrumentTable);
export const instrumentInsertSchema = createInsertSchema(instrumentTable);
