import type { Table } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const zodSelectGenerator = createSelectSchema;

export const zodInsertGenerator = <TTable extends Table>(value: TTable) => {
  const schema = createInsertSchema(value);
  return schema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
};
