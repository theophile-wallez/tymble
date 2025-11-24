import { relations } from 'drizzle-orm';
import {
  assetsTable,
  instrumentTable,
  portfoliosTable,
  transactionsTable,
} from 'schemas';

export const assetsRelations = relations(assetsTable, ({ one, many }) => ({
  instrument: one(instrumentTable, {
    fields: [assetsTable.instrumentId],
    references: [instrumentTable.id],
  }),
  portfolio: one(portfoliosTable, {
    fields: [assetsTable.portfolioId],
    references: [portfoliosTable.id],
  }),
  transactions: many(transactionsTable),
}));
