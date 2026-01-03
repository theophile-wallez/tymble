import {
  ChartDecreaseIcon,
  ChartIncreaseIcon,
} from '@hugeicons/core-free-icons';
import type { ColumnDef } from '@tanstack/react-table';
import type { PortfolioWithRelations } from '@tymble/schemas';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { DataTable } from '@/components/table/data-table';
import { Badge } from '@/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Icon } from '@/ui/icon';

type Asset = PortfolioWithRelations['assets'][number];
type Props = {
  assets: Asset[];
};

export const AssetsList = ({ assets }: Props) => {
  const columns = useMemo<ColumnDef<Asset>[]>(
    () => [
      {
        accessorKey: 'instrument',
        header: 'Instrument',
        cell: ({ row }) => {
          const instrument = row.original.instrument;
          return (
            <div className="py-2">
              <div className="font-medium">
                {instrument?.symbol || 'Unknown'}
              </div>
              <div className="text-muted-foreground text-sm">
                {instrument?.name || 'Unknown instrument'}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => (
          <div className="py-2">
            {Number.parseFloat(row.getValue('quantity')).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              }
            )}
          </div>
        ),
      },
      {
        accessorKey: 'averagePrice',
        header: 'Avg. Price',
        cell: ({ row }) => (
          <div className="py-2">
            $
            {Number.parseFloat(row.getValue('averagePrice')).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </div>
        ),
      },
      {
        id: 'totalValue',
        header: 'Total Value',
        cell: ({ row }) => {
          const quantity = Number.parseFloat(row.original.quantity);
          const price = Number.parseFloat(row.original.averagePrice);
          const total = quantity * price;
          return (
            <div className="py-2 font-medium">
              $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Added',
        cell: ({ row }) => (
          <div className="py-2 text-muted-foreground">
            {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
          </div>
        ),
      },
    ],
    []
  );

  const renderSubComponent = ({ row }: { row: { original: Asset } }) => {
    const asset = row.original;

    // Mock transaction data for display
    // In a real implementation, you would fetch transactions for this asset
    const mockTransactions = [
      {
        id: '1',
        side: 'BUY' as const,
        quantity: asset.quantity,
        price: asset.averagePrice,
        executedAt: asset.createdAt,
        fees: asset.fee,
      },
    ];

    return (
      <div className="p-4">
        <h4 className="mb-3 font-medium text-sm">Transaction History</h4>
        <div className="space-y-2">
          {mockTransactions.map((tx) => (
            <div
              className="flex items-center justify-between rounded-md bg-background p-3"
              key={tx.id}
            >
              <div className="flex items-center gap-3">
                {tx.side === 'BUY' ? (
                  <Badge
                    className="bg-green-500/10 text-green-500"
                    variant="outline"
                  >
                    <Icon className="mr-1 size-3" icon={ChartIncreaseIcon} />
                    Buy
                  </Badge>
                ) : (
                  <Badge
                    className="bg-red-500/10 text-red-500"
                    variant="outline"
                  >
                    <Icon className="mr-1 size-3" icon={ChartDecreaseIcon} />
                    Sell
                  </Badge>
                )}
                <span>
                  {Number.parseFloat(tx.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}{' '}
                  shares
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  @$
                  {Number.parseFloat(tx.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {Number.parseFloat(tx.fees) > 0 && (
                  <span className="text-muted-foreground">
                    Fees: $
                    {Number.parseFloat(tx.fees).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {format(new Date(tx.executedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate portfolio totals
  const totalValue = assets.reduce(
    (sum, asset) =>
      sum +
      Number.parseFloat(asset.quantity) * Number.parseFloat(asset.averagePrice),
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assets Overview</CardTitle>
            <CardDescription>
              All instruments held in this portfolio
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-sm">Total Value</div>
            <div className="font-semibold text-2xl">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={assets}
          emptyMessage="No assets in this portfolio yet."
          renderSubComponent={renderSubComponent}
          variant="spaced"
        />
      </CardContent>
    </Card>
  );
};
