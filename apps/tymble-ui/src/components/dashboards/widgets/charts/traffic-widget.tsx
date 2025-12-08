import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetLayout } from '../widget-layout';

const data = [
  { name: 'Direct', value: 400, color: 'var(--primary)' },
  { name: 'Social', value: 300, color: 'var(--secondary)' },
  { name: 'Organic', value: 300, color: 'var(--muted)' },
  { name: 'Referral', value: 200, color: 'var(--destructive)' },
];

export const TrafficWidget = ({
  isEditing,
  transparent,
}: {
  isEditing?: boolean;
  transparent?: boolean;
}) => (
  <WidgetLayout
    description="Traffic sources"
    isEditing={isEditing}
    title="Traffic Source"
    transparent={transparent}
  >
    <div className="flex h-full min-h-[200px] w-full flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background/50 p-2 shadow-sm backdrop-blur-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] text-muted-foreground uppercase">
                            {payload[0].name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {data.map((item) => (
          <div className="flex items-center gap-2" key={item.name}>
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  </WidgetLayout>
);
