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
import { WidgetLayout } from './widget-layout';

type TableColumn = {
  id: string;
  header: string;
  accessorKey: string;
};

type TableWidgetProps = {
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  title?: string;
  description?: string;
  isEditing?: boolean;
  transparent?: boolean;
};

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
          return String(value ?? '');
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
