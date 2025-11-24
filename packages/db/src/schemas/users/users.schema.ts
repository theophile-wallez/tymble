import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { languageCodeEnum, themeEnum } from '../../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../../helpers';
import { portfoliosTable } from '..';
import { authsTable } from './auths.schema';

export const usersTable = d.pgTable(
  'users',
  {
    id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    firstName: d.varchar({ length: 255 }).notNull(),
    lastName: d.varchar().notNull(),
    birthdate: d.date({
      mode: 'string',
    }),
    bio: d.varchar(),
    isSuperuser: d.boolean().notNull().default(false),
    avatarUrl: d.varchar(),
    emailVerifiedAt: d.timestamp({ mode: 'string' }),
    countryCode: d.varchar({ length: 2 }),
    theme: themeEnum('theme').notNull().default('dark'),
    language: languageCodeEnum('language').notNull().default('en'),
    ...withTimestamps,
  },
  (table) => [d.index('users_email_idx').on(table.email)]
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  portfolios: many(portfoliosTable),
  auths: many(authsTable),
}));

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;

export const userSelectSchema = zodSelectGenerator(usersTable);
export const userInsertSchema = zodInsertGenerator(usersTable);
