import * as d from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { instrumentTypeEnum } from '../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';

/**
 * Metadata schema for an instrument, typically populated from Yahoo Finance.
 */
export const instrumentMetadataSchema = z.object({
  source: z.enum(['yahoo', 'manual']),
  sector: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
  marketCap: z.number().optional(),
  lastSyncedAt: z.iso.datetime().optional(),
});

export type InstrumentMetadata = z.infer<typeof instrumentMetadataSchema>;

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
  metadata: d.jsonb().$type<InstrumentMetadata>(),
  currency: d.varchar({ length: 10 }),
  ...withTimestamps,
});

export const instrumentSelectSchema = zodSelectGenerator(instrumentTable);
export const instrumentInsertSchema = zodInsertGenerator(instrumentTable);
export const instrumentUpdateSchema = zodUpdateGenerator(instrumentTable);

export type InstrumentSelect = z.infer<typeof instrumentSelectSchema>;
export type InstrumentInsert = z.infer<typeof instrumentInsertSchema>;
export type InstrumentUpdate = z.infer<typeof instrumentUpdateSchema>;
