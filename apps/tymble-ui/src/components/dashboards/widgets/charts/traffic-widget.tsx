import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Widget } from '../widget';

const data = [
  { name: 'Direct', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Social', value: 300, color: 'hsl(var(--secondary))' },
  { name: 'Organic', value: 300, color: 'hsl(var(--muted))' },
  { name: 'Referral', value: 200, color: 'hsl(var(--destructive))' },
];

export const TrafficWidget = ({ isEditing }: { isEditing?: boolean }) => (
  <Widget
    description="Traffic sources"
    isEditing={isEditing}
    title="Traffic Source"
  >
    <div className="h-full min-h-[200px] w-full">
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
            {data.map((entry, index) => (
              <Cell fill={entry.color} key={`cell-${index}`} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
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
  </Widget>
);
