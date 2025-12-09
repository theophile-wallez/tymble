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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
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
      <div className="size-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          className={cn(
                            'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                            isSorted
                              ? 'text-foreground'
                              : 'text-muted-foreground'
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
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </WidgetLayout>
  );
};
