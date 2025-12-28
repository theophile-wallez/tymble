import { TooltipProvider } from '@radix-ui/react-tooltip';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ChevronDown,
  Info,
  Phone,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DataTable } from '@/components/table/data-table';
import { WidgetLayout } from '../../widget-layout';
import { SegmentBarItem } from './bar.segment';

type SegmentData = {
  name: string;
  value: number;
  color: string;
  conversionRate?: number;
  visitors?: number;
};

type Props = {
  isEditing?: boolean;
  transparent?: boolean;
  title?: string;
  data: SegmentData[];
  totalRevenue?: string;
  revenueChange?: number;
  totalVisitors?: string;
  visitorsChange?: number;
};

const formatNumber = (num: number) =>
  num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns: ColumnDef<SegmentData>[] = [
  {
    accessorKey: 'name',
    header: 'Products',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className="size-3 shrink-0 rounded"
          style={{ backgroundColor: row.original.color }}
        />
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="text-muted-foreground text-sm">
          {row.original.value.toFixed(2)}%
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'conversionRate',
    header: 'Conversion Rate',
    cell: ({ row }) => (
      <span className="text-foreground">
        {row.original.conversionRate?.toFixed(2)}%
      </span>
    ),
  },
  {
    accessorKey: 'visitors',
    header: 'Visitors',
    cell: ({ row }) => (
      <span className="text-foreground">
        {formatNumber(row.original.visitors ?? 0)}
      </span>
    ),
  },
];

export const SegmentDistributionWidget = ({
  isEditing,
  transparent,
  title = 'Funnels',
  data,
  totalRevenue,
  revenueChange,
  totalVisitors,
  visitorsChange,
}: Props) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetLayout
      cardClassName="p-0"
      isEditing={isEditing}
      transparent={transparent}
    >
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-1 pb-4">
          <div className="flex items-center gap-2">
            <Phone className="size-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{title}</span>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-foreground text-sm transition-colors hover:bg-muted"
            type="button"
          >
            Most Visitors
            <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 px-1 pb-4">
          {totalRevenue && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                Total Revenue
                <Info className="size-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl text-foreground">
                  {totalRevenue}
                </span>
                {revenueChange !== undefined && (
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium text-xs ${
                      revenueChange >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {revenueChange >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {Math.abs(revenueChange)}%
                  </span>
                )}
              </div>
            </div>
          )}
          {totalVisitors && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                Total Visitors
                <Info className="size-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl text-foreground">
                  {totalVisitors}
                </span>
                {visitorsChange !== undefined && (
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium text-xs ${
                      visitorsChange >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {visitorsChange >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {Math.abs(visitorsChange)}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Distribution Bar */}
        <div className="flex h-4 w-full gap-1 overflow-hidden rounded-lg px-1">
          <TooltipProvider>
            {data.map((item, index) => {
              const widthPercent = (item.value / total) * 100;
              return (
                <SegmentBarItem
                  index={index}
                  item={item}
                  key={item.name}
                  widthPercent={widthPercent}
                />
              );
            })}
          </TooltipProvider>
        </div>

        {/* Table */}
        <div className="mt-6 flex-1 overflow-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </WidgetLayout>
  );
};
