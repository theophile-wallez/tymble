import { relations } from 'drizzle-orm';
import { assetsTable, transactionsTable } from 'schemas';

export const transactionRelations = relations(transactionsTable, ({ one }) => ({
  asset: one(assetsTable, {
    fields: [transactionsTable.assetId],
    references: [assetsTable.id],
  }),
}));
