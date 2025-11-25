import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import { iconTypeEnum } from '../../enums/iconType.enum';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../../helpers';

/**
 * Assets table.
 *
 * @description
 * This table stores the assets of the users. An asset is a financial instrument held in a portfolio.
 */
export const iconsTable = d.pgTable('icons', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  type: iconTypeEnum('type').notNull(),
  value: d.varchar({ length: 50 }).notNull(),
  color: d.varchar({
    length: 20,
  }),
  ...withTimestamps,
});

export const iconSelectSchema = zodSelectGenerator(iconsTable);
export const iconInsertSchema = zodInsertGenerator(iconsTable);
export const iconUpdateSchema = zodUpdateGenerator(iconsTable);

export type IconSelect = z.infer<typeof iconSelectSchema>;
export type IconInsert = z.infer<typeof iconInsertSchema>;
export type IconUpdate = z.infer<typeof iconUpdateSchema>;
