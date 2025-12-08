import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { WidgetLayout } from '../widget-layout';

const data = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 80 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 30 },
  { name: 'Sun', value: 40 },
];

export const ActivityWidget = ({
  isEditing,
  transparent,
}: {
  isEditing?: boolean;
  transparent?: boolean;
}) => (
  <WidgetLayout
    description="Daily user activity"
    isEditing={isEditing}
    title="Activity"
    transparent={transparent}
  >
    <div className="h-full min-h-[200px] w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <XAxis
            axisLine={false}
            dataKey="name"
            fontSize={12}
            stroke="var(--muted-foreground)"
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background/50 p-2 shadow-sm backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] text-muted-foreground uppercase">
                          Activity
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
            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
          />
          <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </WidgetLayout>
);
