import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/ui/utils';
import { WidgetLayout } from './widget-layout';

type TableColumn = {
  id: string;
  header: string;
  accessorKey: string;
  variant?: 'text' | 'badge';
  badgeColors?: Record<string, string>;
};

type TableWidgetProps = {
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  title?: string;
  description?: string;
  isEditing?: boolean;
  transparent?: boolean;
};

const Badge = ({
  value,
  colorClass,
}: {
  value: string;
  colorClass?: string;
}) => (
  <span
    className={cn(
      'inline-flex w-fit items-center rounded-full px-2 py-0.5 font-medium text-xs',
      colorClass ??
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    )}
  >
    {value}
  </span>
);

export const TableWidget = ({
  columns,
  rows,
  title,
  description,
  isEditing,
  transparent,
}: TableWidgetProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Convert schema columns to TanStack Table column defs
  const tableColumns = useMemo<ColumnDef<Record<string, unknown>>[]>(
    () =>
      columns.map((col) => ({
        id: col.id,
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ getValue }) => {
          const value = getValue();
          const stringValue = String(value ?? '');

          if (col.variant === 'badge') {
            const colorClass = col.badgeColors?.[stringValue];
            return <Badge colorClass={colorClass} value={stringValue} />;
          }

          return stringValue;
        },
      })),
    [columns]
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <WidgetLayout
      cardClassName="overflow-hidden"
      description={description}
      isEditing={isEditing}
      title={title}
      transparent={transparent}
    >
      <div className="relative size-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-card [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-b transition-colors" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={cn(
                            'flex items-center gap-1 transition-colors hover:text-foreground',
                            isSorted && 'text-foreground'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {isSorted === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : isSorted === 'desc' ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="border-b transition-colors hover:bg-muted/50"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-2 align-middle" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="h-24 p-2 text-center" colSpan={columns.length}>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WidgetLayout>
  );
};
