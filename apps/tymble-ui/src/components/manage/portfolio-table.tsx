import { Delete01Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import type { ColumnDef } from '@tanstack/react-table';
import type { PortfolioWithSimpleRelations } from '@tymble/schemas';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/table/data-table';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/ui/badge';
import { ContextMenuItem, ContextMenuSeparator } from '@/ui/context-menu';
import { Icon } from '@/ui/icon';
import { getProviderLabel } from './portfolio-constants';
import { PortfolioRowActions } from './portfolio-row-actions';

type Props = {
  portfolios: PortfolioWithSimpleRelations[];
  onDeleteClick: (
    e: React.MouseEvent,
    portfolio: PortfolioWithSimpleRelations
  ) => void;
  onRowClick: (portfolio: PortfolioWithSimpleRelations) => void;
};

export const PortfolioTable = ({
  portfolios,
  onDeleteClick,
  onRowClick,
}: Props) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<PortfolioWithSimpleRelations>[]>(
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
            portfolio={row.original}
          />
        ),
      },
    ],
    [onDeleteClick, t]
  );

  const renderContextMenu = useCallback(
    (portfolio: PortfolioWithSimpleRelations) => (
      <>
        <ContextMenuItem
          onClick={(e) => {
            e.stopPropagation();
            toast.info('Edit coming soon!');
          }}
        >
          <Icon className="size-4" icon={PencilEdit01Icon} />
          {t('manage.table.edit')}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={(e) => onDeleteClick(e, portfolio)}
          variant="destructive"
        >
          <Icon className="size-4" icon={Delete01Icon} />
          {t('manage.table.delete')}
        </ContextMenuItem>
      </>
    ),
    [onDeleteClick, t]
  );

  return (
    <section className="w-full">
      <DataTable
        className="bg-background"
        columns={columns}
        data={portfolios}
        emptyMessage={t('manage.table.noPortfolios')}
        onRowClick={onRowClick}
        renderContextMenu={renderContextMenu}
        variant="spaced"
      />
    </section>
  );
};
