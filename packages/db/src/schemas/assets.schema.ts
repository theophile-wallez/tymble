/**
 * Assets that can be bought or sold, for example stocks, crypto, real estate, bonds and more.
 */
import * as d from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../helpers/columns.helpers';

const assetType = d.pgEnum('asset_type', [
  'stock',
  'crypto',
  'real_estate',
  'bond',
]);

export const assetsTable = d.pgTable('assets', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
  ticker: d.varchar({ length: 255 }).notNull(),
  type: assetType('type').notNull(),
  avatarUrl: d.varchar(),
  ...timestamps,
});

export type AssetInsert = typeof assetsTable.$inferInsert;
export type AssetSelect = typeof assetsTable.$inferSelect;

export const assetSelectSchema = createSelectSchema(assetsTable);
export const assetInsertSchema = createInsertSchema(assetsTable);
