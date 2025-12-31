import { TooltipProvider } from '@radix-ui/react-tooltip';
import type { ColumnDef } from '@tanstack/react-table';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { getChartColorByIndex } from '@/utils/getChartColorByIndex';
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
          style={{ backgroundColor: getChartColorByIndex(row.index) }}
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

export const DistributionWidget = ({
  isEditing,
  transparent,
  data,
  totalRevenue,
  revenueChange,
  totalVisitors,
  visitorsChange,
}: Props) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <WidgetLayout
      description="Distribution of your portfolio across different type of assets"
      isEditing={isEditing}
      title="Portfolio distribution"
      transparent={transparent}
    >
      <div className="flex h-full w-full flex-col">
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
        <div className="flex h-5 w-full overflow-hidden rounded-lg px-1">
          <TooltipProvider>
            {data.map((item, index) => {
              const widthPercent = (item.value / total) * 100;
              return (
                <SegmentBarItem
                  hoveredIndex={hoveredIndex}
                  index={index}
                  item={item}
                  key={item.name}
                  onHover={setHoveredIndex}
                  onLeave={() => setHoveredIndex(null)}
                  widthPercent={widthPercent}
                />
              );
            })}
          </TooltipProvider>
        </div>

        {/* Table */}
        <div className="mt-6 flex-1 overflow-auto">
          <DataTable
            columns={columns}
            data={data}
            hoveredIndex={hoveredIndex}
            onHoverChange={setHoveredIndex}
          />
        </div>
      </div>
    </WidgetLayout>
  );
};
