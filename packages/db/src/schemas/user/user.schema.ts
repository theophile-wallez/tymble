import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { languageCodeEnum } from '../../enums/language.enum';
import { themeEnum } from '../../enums/theme.enum';
import { timestamps } from '../../helpers/timestamps.helpers';
import { languageTable } from '../language/language.schema';

export const usersTable = d.pgTable('users', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  firstName: d.varchar({ length: 255 }).notNull(),
  lastName: d.varchar().notNull(),
  birthdate: d.date(),
  bio: d.varchar(),
  isSuperuser: d.boolean().notNull().default(false),
  avatarUrl: d.varchar(),
  emailVerified: d.boolean().notNull().default(false),
  countryCode: d.varchar({ length: 2 }),
  theme: themeEnum('theme').notNull().default('dark'),
  language: languageCodeEnum('language')
    .notNull()
    .references(() => languageTable.code)
    .default('en'),
  ...timestamps,
});

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);
