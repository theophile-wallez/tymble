import type { Table } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';

export const zodSelectGenerator = createSelectSchema;

export const zodInsertGenerator = <TTable extends Table>(value: TTable) => {
  const schema = createSelectSchema(value);
  return schema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
};
