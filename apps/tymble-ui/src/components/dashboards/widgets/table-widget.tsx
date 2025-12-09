import type { ColumnDef, Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from '@/components/table/data-table';
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

/**
 * Converts camelCase to a human-readable label
 * e.g., "dueDate" -> "Due Date"
 */
const formatLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const RowDetails = ({ row }: { row: Row<Record<string, unknown>> }) => {
  const details = row.original.details as Record<string, unknown> | undefined;

  if (!details || typeof details !== 'object') {
    return null;
  }

  const entries = Object.entries(details).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2 py-2 text-sm">
      {entries.map(([key, value]) => (
        <div key={key}>
          <span className="font-medium text-muted-foreground">
            {formatLabel(key)}:{' '}
          </span>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );
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

  return (
    <WidgetLayout
      cardClassName="overflow-hidden"
      description={description}
      isEditing={isEditing}
      title={title}
      transparent={transparent}
    >
      <DataTable
        columns={tableColumns}
        data={rows}
        renderSubComponent={RowDetails}
      />
    </WidgetLayout>
  );
};
