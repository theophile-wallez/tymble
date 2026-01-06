import * as d from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { type InstrumentType, instrumentTypeDbSchema } from '../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../helpers';

/**
 * Metadata schema for an instrument, typically populated from Yahoo Finance.
 * Uses passthrough() to allow additional Yahoo Finance fields beyond the core ones.
 */
export const instrumentMetadataSchema = z
  .object({
    lastSyncedAt: z.string().optional(),
    // Core fields
    sector: z.string().optional(),
    industry: z.string().optional(),
    country: z.string().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    marketCap: z.number().optional(),
    // Financial metrics
    trailingPE: z.number().optional(),
    forwardPE: z.number().optional(),
    dividendYield: z.number().optional(),
    beta: z.number().optional(),
    fiftyTwoWeekHigh: z.number().optional(),
    fiftyTwoWeekLow: z.number().optional(),
    averageVolume: z.number().optional(),
    // Company info
    fullTimeEmployees: z.number().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    longBusinessSummary: z.string().optional(),
  })
  .loose(); // Allow additional Yahoo Finance fields

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
  type: instrumentTypeDbSchema('type').notNull(),
  exchange: d.varchar({ length: 100 }),
  metadata: d.jsonb().$type<InstrumentMetadata>(),
  sector: d.varchar({ length: 100 }),
  industry: d.varchar({ length: 100 }),
  website: d.varchar({ length: 255 }),
  currency: d.varchar({ length: 10 }),
  ...withTimestamps,
});

/**
 * Reusable: "if type === 'equity' then sector & industry are required"
 *
 * Assumptions:
 * - Base schema has keys: type, sector, industry
 * - Base schema's `type` includes 'equity'
 */
function withEquityRequirements<S extends z.ZodTypeAny>(base: S) {
  // biome-ignore lint/suspicious/noExplicitAny: We're getting out of my TypeScript patience
  return base.superRefine((data: any, ctx) => {
    if (data?.type === 'equity' && !(data?.sector && data?.industry)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sector and industry are required for equity',
      });
    }
  });
}

// ---- usage ----

export const instrumentSelectSchema = withEquityRequirements(
  zodSelectGenerator(instrumentTable)
);

export const instrumentInsertSchema = withEquityRequirements(
  zodInsertGenerator(instrumentTable).extend({
    name: z.string().min(1, 'Name should be at least 1 character'),
  })
);

export const instrumentUpdateSchema = withEquityRequirements(
  zodUpdateGenerator(instrumentTable)
);

/**
 * ### Why did I create this horendous helper?
 *
 * I basically want to have a type safe way to access the `sector` and `industry` fields *only* if the type is `'equity'`.
 *
 * I did not find a way to do this using Zod, since:
 * - using `zod.superRefine()` does not create a type discriminated union.
 * - using `schema.and(z.discriminatedUnion('type', [...]))` creates an underlying union zod object,
 * which makes using `z.object` functions such as `.omit()` or `.extend()` later on impossible.
 *
 * This way, my schemas keep being actual *"z.object() like"* objects with their associated functions.
 */

type WithEquityRequirements<
  ProvidedType extends {
    type?: InstrumentType;
    sector?: string | null;
    industry?: string | null;
  },
> =
  | ({
      type: Extract<ProvidedType['type'], 'equity'>;
    } & Omit<ProvidedType, 'type'>)
  | ({
      type: Exclude<ProvidedType['type'], 'equity'>;
    } & Omit<ProvidedType, 'type' | 'sector' | 'industry'>);

export type InstrumentSelect = WithEquityRequirements<
  z.infer<typeof instrumentSelectSchema>
>;
export type InstrumentInsert = WithEquityRequirements<
  z.infer<typeof instrumentInsertSchema>
>;
export type InstrumentUpdate = WithEquityRequirements<
  z.infer<typeof instrumentUpdateSchema>
>;
