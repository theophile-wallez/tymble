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
  variant?: 'default' | 'spaced';
} & (
  | {
      canHover?: false;
      hoveredIndex?: never;
      onHoverChange?: never;
    }
  | {
      canHover: true;
      hoveredIndex?: number | null;
      onHoverChange?: (index: number | null) => void;
    }
);

export function DataTable<TData>(props: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => !!props?.renderSubComponent,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const isSpaced = props.variant === 'spaced';

  return (
    <div
      className="size-full overflow-auto"
      style={{ scrollbarGutter: 'stable' }}
    >
      <Table
        className={cn(isSpaced && 'border-separate border-spacing-y-2')}
      >
        <TableHeader className="sticky top-0 z-10 bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {props.renderSubComponent && <TableHead className="w-10" />}
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
            table.getRowModel().rows.map((row) => {
              const isHovered =
                props.canHover && props.hoveredIndex === row.index;
              const isFaded =
                props.canHover &&
                props.hoveredIndex !== null &&
                props.hoveredIndex !== row.index;

              return (
                <Fragment key={row.id}>
                  <TableRow
                    className={cn(
                      'hover:bg-muted/50',
                      isSpaced &&
                        'border-0 bg-muted/20 [&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg',
                      props.renderSubComponent && 'cursor-pointer',
                      isHovered && 'bg-muted/50',
                      isFaded && 'opacity-60'
                    )}
                    onClick={
                      props.renderSubComponent
                        ? () => row.toggleExpanded()
                        : undefined
                    }
                    onMouseEnter={() =>
                      props.canHover && props.onHoverChange?.(row.index)
                    }
                    onMouseLeave={() =>
                      props.canHover && props.onHoverChange?.(null)
                    }
                  >
                    {props.renderSubComponent && (
                      <TableCell>
                        <ChevronRight
                          className={cn(
                            'size-4 shrink-0 origin-center text-muted-foreground transition-transform ease-out',
                            row.getIsExpanded() ? 'rotate-90' : undefined
                          )}
                        />
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
                  {props.renderSubComponent && (
                    <tr className="">
                      <TableCell
                        className="rounded-b-md bg-muted/30 p-0!"
                        colSpan={row.getVisibleCells().length + 1}
                      >
                        <motion.div
                          animate={{
                            gridTemplateRows: row.getIsExpanded()
                              ? '1fr'
                              : '0fr',
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
                              filter: row.getIsExpanded()
                                ? 'blur(0px)'
                                : 'blur(3px)',
                            }}
                            className="overflow-hidden"
                            transition={{
                              duration: 0.15,
                            }}
                          >
                            <div className="px-2 py-3">
                              {props.renderSubComponent({ row })}
                            </div>
                          </motion.div>
                        </motion.div>
                      </TableCell>
                    </tr>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                className="h-24 text-center text-muted-foreground"
                colSpan={
                  props.columns.length + (props.renderSubComponent ? 1 : 0)
                }
              >
                {props.emptyMessage ?? 'No results.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
