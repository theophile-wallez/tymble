import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import { instrumentTypeEnum } from '../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';

/**
 * Instrument table.
 *
 * @description
 * This table stores the financial instruments available in the application.
 * Each instrument has a symbol, name, and type (e.g. stock, bond, ETF).
 */

export const instrumentTable = d.pgTable('instruments', {
  id: d.uuid().primaryKey().defaultRandom(),
  symbol: d.varchar({ length: 64 }).notNull().unique(),
  name: d.varchar({ length: 255 }).notNull(),
  type: instrumentTypeEnum('type').notNull(),
  exchange: d.varchar({ length: 100 }),
  currency: d.varchar({ length: 10 }),
  ...withTimestamps,
});

export const instrumentSelectSchema = zodSelectGenerator(instrumentTable);
export const instrumentInsertSchema = zodInsertGenerator(instrumentTable);
export const instrumentUpdateSchema = zodUpdateGenerator(instrumentTable);

export type InstrumentSelect = z.infer<typeof instrumentSelectSchema>;
export type InstrumentInsert = z.infer<typeof instrumentInsertSchema>;
export type InstrumentUpdate = z.infer<typeof instrumentUpdateSchema>;
