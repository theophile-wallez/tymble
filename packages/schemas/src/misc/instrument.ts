import { instrumentTypeSchema as instrumentTypeDbSchema } from '@tymble/db';
import type { z } from 'zod';

export const instrumentTypeSchema = instrumentTypeDbSchema;
export type InstrumentType = z.infer<typeof instrumentTypeSchema>;
