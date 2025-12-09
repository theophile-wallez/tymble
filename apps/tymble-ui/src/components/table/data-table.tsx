import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type Row,
  type SortDirection,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Fragment, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { cn } from '@/ui/utils';

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

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  renderSubComponent?: (props: {
    row: Row<TData>;
  }) => React.ReactElement | null;
};

export function DataTable<TData>({
  columns,
  data,
  emptyMessage = 'No results.',
  renderSubComponent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => !!renderSubComponent,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="size-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {renderSubComponent && <TableHead className="w-10" />}
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <TableHead key={header.id}>
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
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  className={renderSubComponent ? 'cursor-pointer' : undefined}
                  onClick={
                    renderSubComponent ? () => row.toggleExpanded() : undefined
                  }
                >
                  {renderSubComponent && (
                    <TableCell className="w-10">
                      <motion.div
                        animate={{ rotate: row.getIsExpanded() ? 90 : 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </motion.div>
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {renderSubComponent && (
                  <tr className="bg-muted/30">
                    <TableCell
                      className="p-0!"
                      colSpan={row.getVisibleCells().length + 1}
                    >
                      <motion.div
                        animate={{
                          gridTemplateRows: row.getIsExpanded() ? '1fr' : '0fr',
                        }}
                        className="grid"
                        initial={{ gridTemplateRows: '0fr' }}
                        transition={{
                          duration: 0.15,
                          ease: 'easeOut',
                        }}
                      >
                        <motion.div
                          animate={{
                            opacity: row.getIsExpanded() ? 1 : 0,
                          }}
                          className="overflow-hidden"
                          initial={{ opacity: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: row.getIsExpanded() ? 0.1 : 0,
                          }}
                        >
                          <div className="px-2 py-3">
                            {renderSubComponent({ row })}
                          </div>
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="h-24 text-center text-muted-foreground"
                colSpan={columns.length + (renderSubComponent ? 1 : 0)}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
