import {
  integer,
  type PgColumn,
  type UpdateDeleteAction,
} from 'drizzle-orm/pg-core';

export const drizzleRef = (
  col: PgColumn,
  /** Action to perform on delete. @default 'cascade' */
  onDelete: UpdateDeleteAction = 'cascade'
) =>
  integer()
    .notNull()
    .references(() => col, {
      onDelete,
    });
