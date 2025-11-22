import * as d from 'drizzle-orm/pg-core';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../helpers';
import { iconsTable } from './misc/icons.schema';
import { usersTable } from './users.schema';

export const dashboardsTable = d.pgTable('dashboards', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  iconId: drizzleRef(iconsTable.id),
  userId: drizzleRef(usersTable.id),
  title: d.varchar({ length: 255 }).notNull(),
  description: d.varchar(),

  // TODO: Define dashboard fields
  ...withTimestamps,
});

export type DashboardInsert = typeof dashboardsTable.$inferInsert;
export type DashboardSelect = typeof dashboardsTable.$inferSelect;

export const dashboardSelectSchema = zodSelectGenerator(dashboardsTable);
export const dashboardInsertSchema = zodInsertGenerator(dashboardsTable);
