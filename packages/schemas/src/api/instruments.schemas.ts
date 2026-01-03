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

const searchedinstrumentSchema = instrumentSelectSchema.extend({
  source: z.enum(['local', 'remote']),
});

export const searchInstrumentSchema = {
  dto: z.object({
    name: z.string(),
  }),
  res: z.object({
    instruments: z.array(searchedinstrumentSchema),
  }),
} as const satisfies DTOStructure;

export type SearchInstrument = InferDto<typeof searchInstrumentSchema>;
export type SearchedInstrument = z.infer<typeof searchedinstrumentSchema>;
