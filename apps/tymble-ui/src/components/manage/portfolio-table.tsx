import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { Portfolio } from '@/api/portfolios';
import { DataTable } from '@/components/table/data-table';
import { useTranslation } from '@/hooks/use-translation';
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
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Portfolio>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('manage.table.name'),
        cell: ({ row }) => (
          <div className="py-2">
            <span className="font-medium">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: t('manage.table.type'),
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.getValue('type')}</Badge>
          </div>
        ),
      },
      {
        accessorKey: 'provider',
        header: t('manage.table.provider'),
        cell: ({ row }) => (
          <div className="py-2">
            {getProviderLabel(row.getValue('provider'))}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('manage.table.created'),
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
    [onDeleteClick, onManageClick, t]
  );

  return (
    <section className="w-full">
      <DataTable
        className="bg-background"
        columns={columns}
        data={portfolios}
        emptyMessage={t('manage.table.noPortfolios')}
        renderSubComponent={PortfolioRowDetails}
        variant="spaced"
      />
    </section>
  );
};
