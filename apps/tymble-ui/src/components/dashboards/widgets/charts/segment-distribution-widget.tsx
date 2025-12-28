import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetLayout } from '../widget-layout';

type SegmentData = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  isEditing?: boolean;
  transparent?: boolean;
  title?: string;
  description?: string;
  data?: SegmentData[];
};

const defaultData: SegmentData[] = [
  { name: 'Technology', value: 35, color: '#6366f1' },
  { name: 'Healthcare', value: 22, color: '#8b5cf6' },
  { name: 'Finance', value: 18, color: '#a855f7' },
  { name: 'Energy', value: 15, color: '#d946ef' },
  { name: 'Consumer', value: 10, color: '#ec4899' },
];

export const SegmentDistributionWidget = ({
  isEditing,
  transparent,
  title = 'Segment Distribution',
  description = 'Portfolio allocation by sector',
  data = defaultData,
}: Props) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetLayout
      description={description}
      isEditing={isEditing}
      title={title}
      transparent={transparent}
    >
      <div className="flex h-full min-h-[200px] w-full flex-col gap-4 md:flex-row">
        {/* Chart section */}
        <div className="relative min-h-[180px] flex-1">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry) => (
                  <Cell
                    fill={entry.color}
                    key={entry.name}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    const percentage = (
                      ((item.value as number) / total) *
                      100
                    ).toFixed(1);
                    return (
                      <div className="rounded-lg border bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-full"
                            style={{
                              backgroundColor: item.payload?.color as string,
                            }}
                          />
                          <span className="font-medium text-foreground text-sm">
                            {item.name}
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-bold text-foreground text-lg">
                            {percentage}%
                          </span>
                          <span className="text-muted-foreground text-xs">
                            ({item.value})
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 text-center">
            <span className="block font-bold text-foreground text-xl">
              {data.length}
            </span>
            <span className="text-muted-foreground text-xs">Segments</span>
          </div>
        </div>

        {/* Legend section */}
        <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 md:flex-col md:justify-center md:gap-3">
          {data.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                key={item.name}
              >
                <div
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-xs font-medium">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetLayout>
  );
};

