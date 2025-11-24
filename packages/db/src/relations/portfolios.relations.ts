import { relations } from 'drizzle-orm';
import { assetsTable, portfoliosTable, usersTable } from '../schemas';

export const portfoliosRelations = relations(
  portfoliosTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [portfoliosTable.userId],
      references: [usersTable.id],
    }),
    assets: many(assetsTable),
  })
);
