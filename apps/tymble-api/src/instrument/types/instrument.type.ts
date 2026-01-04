import { instrumentInsertSchema } from '@tymble/db';
import z from 'zod';

export type NewInstrument = z.infer<typeof instrumentInsertSchema>;
