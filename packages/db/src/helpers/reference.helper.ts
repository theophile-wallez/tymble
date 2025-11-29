import {
  type PgColumn,
  type UpdateDeleteAction,
  uuid,
} from 'drizzle-orm/pg-core';

export const drizzleRef = (
  col: PgColumn,
  /** Action to perform on delete. @default 'cascade' */
  onDelete: UpdateDeleteAction = 'cascade'
) =>
  uuid()
    .notNull()
    .references(() => col, {
      onDelete,
    });
