import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import { languageCodeEnum, themeEnum } from '../../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../../helpers';

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

// export type UserSelect = typeof usersTable.$inferSelect;
// export type UserInsert = typeof usersTable.$inferInsert;

export const userSelectSchema = zodSelectGenerator(usersTable);
export const userInsertSchema = zodInsertGenerator(usersTable);

export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
