import * as d from 'drizzle-orm/pg-core';

export const timestamps = {
  updatedAt: d.timestamp().defaultNow().notNull(),
  createdAt: d.timestamp().defaultNow().notNull(),
  deletedAt: d.timestamp(),
};
