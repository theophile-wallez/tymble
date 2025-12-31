import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { Portfolio } from '@/api/portfolios';
import { DataTable } from '@/components/table/data-table';
import { Badge } from '@/ui/badge';
import { getProviderLabel } from './portfolio-constants';
import { PortfolioRowActions } from './portfolio-row-actions';
import { PortfolioRowDetails } from './portfolio-row-details';

type Props = {
  portfolios: Portfolio[];
  onDeleteClick: (e: React.MouseEvent, portfolio: Portfolio) => void;
  onManageClick?: (e: React.MouseEvent, portfolio: Portfolio) => void;
};

export const PortfolioTable = ({
  portfolios,
  onDeleteClick,
  onManageClick,
}: Props) => {
  const columns = useMemo<ColumnDef<Portfolio>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="py-2">
            <span className="font-medium">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.getValue('type')}</Badge>
          </div>
        ),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => (
          <div className="py-2">
            {getProviderLabel(row.getValue('provider'))}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <div className="py-2">
            {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <PortfolioRowActions
            onDelete={onDeleteClick}
            onManage={onManageClick}
            portfolio={row.original}
          />
        ),
      },
    ],
    [onDeleteClick, onManageClick]
  );

  return (
    <section className="w-full">
      <DataTable
        className="bg-background"
        columns={columns}
        data={portfolios}
        emptyMessage="No portfolios found."
        renderSubComponent={PortfolioRowDetails}
        variant="spaced"
      />
    </section>
  );
};
