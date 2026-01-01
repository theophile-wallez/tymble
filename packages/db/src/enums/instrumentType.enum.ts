import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const instrumentTypes = ['stock', 'bond', 'etf', 'crypto'] as const;

export const instrumentTypeDbSchema = pgEnum(
  'instrument_type',
  instrumentTypes
);

export type InstrumentType = (typeof instrumentTypes)[number];
export const instrumentTypeSchema = z.enum(instrumentTypes);
