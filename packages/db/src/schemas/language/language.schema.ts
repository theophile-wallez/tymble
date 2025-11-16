import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { languageCodeEnum } from '../../enums/language.enum';
import { timestamps } from '../../helpers/timestamps.helpers';

/**
 * Language table.
 *
 * @description
 * This table stores the languages available in the application.
 * Each language has a code (e.g. 'en', 'fr') and a name (e.g. 'English', 'French').
 */

export const languageTable = d.pgTable('languages', {
  code: languageCodeEnum('code').primaryKey().unique(),
  name: d.varchar({ length: 100 }).notNull(),
  emoji: d.varchar({ length: 10 }).notNull(),
  ...timestamps,
});

export type LanguageInsert = typeof languageTable.$inferInsert;
export type LanguageSelect = typeof languageTable.$inferSelect;

export const languageSelectSchema = createSelectSchema(languageTable);
export const languageInsertSchema = createInsertSchema(languageTable);
