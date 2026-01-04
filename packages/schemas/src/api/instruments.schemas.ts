import {
  instrumentInsertSchema,
  instrumentSelectSchema,
  instrumentUpdateSchema,
} from '@tymble/db';
import z from 'zod';
import type { DTOStructure, InferDto } from '../types';

/**
 * Create Instrument Schema
 */

export const createInstrumentSchema = {
  dto: instrumentInsertSchema.omit({
    id: true,
  }),
  res: instrumentSelectSchema,
} satisfies DTOStructure;

export type CreateInstrument = InferDto<typeof createInstrumentSchema>;

/**
 * Update Instrument Schema
 */

export const updateInstrumentSchema = {
  dto: instrumentUpdateSchema.omit({
    id: true,
  }),
  res: instrumentSelectSchema,
} satisfies DTOStructure;

export type UpdateInstrument = InferDto<typeof updateInstrumentSchema>;

/**
 * Search Instrument Schema
 */

export const searchInstrumentSchema = {
  query: z.object({
    name: z.string(),
  }),
  res: z.object({
    instruments: z.array(instrumentSelectSchema),
  }),
} as const satisfies DTOStructure;

export type SearchInstrument = InferDto<typeof searchInstrumentSchema>;
// TODO: Remove this type
export type SearchedInstrument = z.infer<typeof instrumentSelectSchema>;
