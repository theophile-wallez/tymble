import { relations } from 'drizzle-orm';
import { authsTable, portfoliosTable, usersTable } from 'schemas';

export const usersRelations = relations(usersTable, ({ many }) => ({
  portfolios: many(portfoliosTable),
  auths: many(authsTable),
}));
