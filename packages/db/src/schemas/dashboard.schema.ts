import * as d from 'drizzle-orm/pg-core';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../helpers';
import { instrumentTable } from './instrument.schema';
import { portfolioTable } from './portfolio.schema';
import { usersTable } from './users.schema';

export const dashboardsTable = d.pgTable('dashboards', {
  id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: drizzleRef(usersTable.id, 'cascade'),
  instrumentId: drizzleRef(instrumentTable.id, 'no action'),
  portfolioId: drizzleRef(portfolioTable.id, 'cascade'),
  quantity: d.numeric({ precision: 28, scale: 18 }).notNull(),
  averagePrice: d.numeric({ precision: 18, scale: 18 }).notNull(),
  lastFees: d.numeric({ precision: 18, scale: 18 }).notNull().default('0'),
  lastTaxes: d.numeric({ precision: 18, scale: 8 }).notNull().default('0'),
  ...withTimestamps,
});

export type DashboardInsert = typeof dashboardsTable.$inferInsert;
export type DashboardSelect = typeof dashboardsTable.$inferSelect;

export const dashboardSelectSchema = zodSelectGenerator(dashboardsTable);
export const dashboardInsertSchema = zodInsertGenerator(dashboardsTable);
