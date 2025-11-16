import * as d from 'drizzle-orm/pg-core';

export const withIcon = {
  updatedAt: d
    .timestamp({
      mode: 'string',
    })
    .defaultNow()
    .notNull(),
  createdAt: d.timestamp({ mode: 'string' }).defaultNow().notNull(),
  deletedAt: d.timestamp({
    mode: 'string',
  }),
};
