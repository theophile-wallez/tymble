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

const TaskDetails = ({ row }: { row: Row<Record<string, unknown>> }) => {
  const data = row.original;
  const description = data.description as string | undefined;
  const assignee = data.assignee as string | undefined;
  const dueDate = data.dueDate as string | undefined;

  return (
    <div className="space-y-2 py-2 text-sm">
      {description && (
        <div>
          <span className="font-medium text-muted-foreground">
            Description:{' '}
          </span>
          <span>{description}</span>
        </div>
      )}
      <div className="flex gap-6">
        {assignee && (
          <div>
            <span className="font-medium text-muted-foreground">
              Assignee:{' '}
            </span>
            <span>{assignee}</span>
          </div>
        )}
        {dueDate && (
          <div>
            <span className="font-medium text-muted-foreground">
              Due Date:{' '}
            </span>
            <span>{dueDate}</span>
          </div>
        )}
      </div>
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
        renderSubComponent={TaskDetails}
      />
    </WidgetLayout>
  );
};
