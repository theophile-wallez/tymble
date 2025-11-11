import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '@/db/helpers/columns.helpers';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar().notNull(),
  age: integer(),
  bio: varchar(),
  isSuperuser: boolean().notNull().default(false),
  ...timestamps,
});

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;
