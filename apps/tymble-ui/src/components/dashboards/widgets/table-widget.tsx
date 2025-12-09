import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortDirection,
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

type SortIconProps = {
  direction: false | SortDirection;
};

const SortIcon = ({ direction }: SortIconProps) => {
  if (direction === 'asc') {
    return <ArrowUp className="size-3.5" />;
  }
  if (direction === 'desc') {
    return <ArrowDown className="size-3.5" />;
  }
  return <ArrowUpDown className="size-3.5 opacity-50" />;
};

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
      columns.map(
        (col) =>
          ({
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
          }) satisfies ColumnDef<Record<string, unknown>>
      ),
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
      <div className="flex size-full flex-col overflow-hidden">
        <div className="shrink-0 border-b bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              className="grid"
              key={headerGroup.id}
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              }}
            >
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <div
                    className="flex h-10 items-center px-2 font-medium text-foreground"
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn(
                          'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                          isSorted ? 'text-foreground' : 'text-muted-foreground'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <SortIcon direction={isSorted} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                className="grid border-b transition-colors hover:bg-muted/50"
                key={row.id}
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div className="flex items-center p-2 text-sm" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      </div>
    </WidgetLayout>
  );
};
