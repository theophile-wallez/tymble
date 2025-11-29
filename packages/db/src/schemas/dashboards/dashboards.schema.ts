import * as d from 'drizzle-orm/pg-core';
import type z from 'zod';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
  zodUpdateGenerator,
} from '../../helpers';
import { iconsTable } from '../misc/icons.schema';
import { usersTable } from '../users/users.schema';

export const dashboardsTable = d.pgTable('dashboards', {
  id: d.uuid().primaryKey().defaultRandom(),
  iconId: drizzleRef(iconsTable.id),
  userId: drizzleRef(usersTable.id, 'cascade'),
  title: d.varchar({ length: 255 }).notNull(),
  description: d.varchar(),

  // TODO: Define dashboard fields
  ...withTimestamps,
});

export const dashboardSelectSchema = zodSelectGenerator(dashboardsTable);
export const dashboardInsertSchema = zodInsertGenerator(dashboardsTable);
export const dashboardUpdateSchema = zodUpdateGenerator(dashboardsTable);

export type DashboardSelect = z.infer<typeof dashboardSelectSchema>;
export type DashboardInsert = z.infer<typeof dashboardInsertSchema>;
export type DashboardUpdate = z.infer<typeof dashboardUpdateSchema>;
