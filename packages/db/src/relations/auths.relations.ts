import { relations } from 'drizzle-orm';
import { authsTable, usersTable } from '../schemas';

export const authsRelations = relations(authsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [authsTable.userId],
    references: [usersTable.id],
  }),
}));
