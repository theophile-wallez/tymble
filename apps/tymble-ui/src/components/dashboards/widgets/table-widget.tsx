import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
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

export const TableWidget = ({
  columns,
  rows,
  title,
  description,
  isEditing,
  transparent,
}: TableWidgetProps) => {
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <WidgetLayout
      description={description}
      isEditing={isEditing}
      title={title}
      transparent={transparent}
    >
      <Table className="size-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="overflow-auto">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </WidgetLayout>
  );
};
