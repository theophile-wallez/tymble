import type { Table } from 'drizzle-orm';
import type {
  BuildRefine,
  CreateInsertSchema,
  CreateUpdateSchema,
  NoUnknownKeys,
} from 'drizzle-zod';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
export const zodSelectGenerator = createSelectSchema;
export const zodUpdateGenerator = (<TTable extends Table>(table: TTable) => {
  const schema = createUpdateSchema(table).strict();
  return schema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
}) satisfies CreateUpdateSchema<undefined>;

export const zodInsertGenerator = (<
  TTable extends Table,
  TRefine extends BuildRefine<
    Pick<TTable['_']['columns'], keyof TTable['$inferInsert']>,
    undefined
  >,
>(
  table: TTable,
  refine?: TRefine extends undefined
    ? undefined
    : NoUnknownKeys<TRefine, TTable['$inferInsert']>
) => {
  const schema = createInsertSchema(table, refine).strict();
  return schema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
}) satisfies CreateInsertSchema<undefined>;
