/**
 * Financial operations made by the user.
 * It can be a buy or sell an asset.
 */
import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { assetsTable } from './assets.schema';
import { usersTable } from './users.schema';

const operationType = d.pgEnum('operation_type', ['buy', 'sell']);

export const operationsTable = d.pgTable('operations', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: d
    .integer()
    .notNull()
    .references(() => usersTable.id),
  assetId: d
    .integer()
    .notNull()
    .references(() => assetsTable.id),
  type: operationType('type').notNull(),
  amount: d.decimal().notNull(),
  price: d.decimal().notNull(),
  createdAt: d.timestamp().notNull().defaultNow(),
});

export type OperationInsert = typeof operationsTable.$inferInsert;
export type OperationSelect = typeof operationsTable.$inferSelect;

export const operationSelectSchema = createSelectSchema(operationsTable);
export const operationInsertSchema = createInsertSchema(operationsTable);
