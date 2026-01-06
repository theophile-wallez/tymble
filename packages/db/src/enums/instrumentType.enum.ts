import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const INSTRUMENT_TYPES = [
  'equity',
  'bond',
  'etf',
  'crypto',
  'index',
  'future',
  'option',
  'money_market',
  'currency',
] as const;

export const instrumentTypeDbSchema = pgEnum(
  'instrument_type',
  INSTRUMENT_TYPES
);

export type InstrumentType = (typeof INSTRUMENT_TYPES)[number];
export const instrumentTypeSchema = z.enum(INSTRUMENT_TYPES);
