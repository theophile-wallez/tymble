import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../helpers/columns.helpers';

export const usersTable = d.pgTable('users', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  firstName: d.varchar({ length: 255 }).notNull(),
  lastName: d.varchar().notNull(),
  birthdate: d.date(),
  bio: d.varchar(),
  isSuperuser: d.boolean().notNull().default(false),
  avatarUrl: d.varchar(),
  ...timestamps,
});

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);
