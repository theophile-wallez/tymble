import { useEffect, useRef, useState } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

// Widget wrapper component for consistent styling
const Widget = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card className="size-full overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="font-medium text-sm">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex-1">{children}</CardContent>
  </Card>
);

// Mock data for widgets
const statsData = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
  { label: 'Subscriptions', value: '+2350', change: '+180.1%' },
  { label: 'Sales', value: '+12,234', change: '+19%' },
  { label: 'Active Now', value: '+573', change: '+201' },
];

const activityData = [
  { user: 'John Doe', action: 'Created new project', time: '2 min ago' },
  { user: 'Jane Smith', action: 'Updated dashboard', time: '5 min ago' },
  { user: 'Bob Johnson', action: 'Deployed changes', time: '10 min ago' },
  { user: 'Alice Brown', action: 'Added new widget', time: '15 min ago' },
];

const tasksData = [
  { title: 'Review pull requests', status: 'In Progress', priority: 'High' },
  { title: 'Update documentation', status: 'Pending', priority: 'Medium' },
  { title: 'Fix authentication bug', status: 'Done', priority: 'High' },
  { title: 'Design new landing page', status: 'In Progress', priority: 'Low' },
];

// Initial layout configuration
const initialLayout: Layout[] = [
  { i: 'stats-1', x: 0, y: 0, w: 3, h: 3 },
  { i: 'stats-2', x: 3, y: 0, w: 3, h: 3 },
  { i: 'stats-3', x: 6, y: 0, w: 3, h: 3 },
  { i: 'stats-4', x: 9, y: 0, w: 3, h: 3 },
  { i: 'chart', x: 0, y: 3, w: 8, h: 6 },
  { i: 'activity', x: 8, y: 3, w: 4, h: 6 },
  { i: 'tasks', x: 0, y: 9, w: 12, h: 5 },
];

export const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [layout, setLayout] = useState(initialLayout);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      <GridLayout
        className="layout"
        cols={12}
        draggableHandle=".drag-handle"
        layout={layout}
        onLayoutChange={setLayout}
        rowHeight={30}
        width={width}
      >
        {/* Stats Widgets */}
        {statsData.map((stat, index) => (
          <div key={`stats-${index + 1}`}>
            <Widget title={stat.label}>
              <div className="drag-handle cursor-move">
                <p className="font-bold text-2xl">{stat.value}</p>
                <p className="text-muted-foreground text-xs">
                  <span className="text-green-500">{stat.change}</span> from
                  last month
                </p>
              </div>
            </Widget>
          </div>
        ))}

        {/* Chart Widget */}
        <div key="chart">
          <Widget description="Monthly revenue overview" title="Overview">
            <div className="drag-handle flex h-full cursor-move items-end gap-2 pb-4">
              {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 50, 95].map(
                (height, i) => (
                  <div
                    className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                    key={i}
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </Widget>
        </div>

        {/* Activity Widget */}
        <div key="activity">
          <Widget description="Latest user actions" title="Recent Activity">
            <div className="drag-handle cursor-move space-y-3">
              {activityData.map((item, i) => (
                <div
                  className="flex items-center gap-3 border-border border-b pb-2 last:border-0"
                  key={i}
                >
                  <div className="size-8 shrink-0 rounded-full bg-primary/10" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.user}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {item.action}
                    </p>
                  </div>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </Widget>
        </div>

        {/* Tasks Widget */}
        <div key="tasks">
          <Widget description="Your current tasks" title="Tasks">
            <div className="drag-handle cursor-move">
              <div className="grid grid-cols-4 gap-4 font-medium text-muted-foreground text-xs">
                <span>Task</span>
                <span>Status</span>
                <span>Priority</span>
                <span />
              </div>
              <div className="mt-2 space-y-2">
                {tasksData.map((task, i) => (
                  <div
                    className="grid grid-cols-4 items-center gap-4 rounded-md bg-muted/50 p-2 text-sm"
                    key={i}
                  >
                    <span className="truncate font-medium">{task.title}</span>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs ${
                        task.status === 'Done'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button className="text-muted-foreground text-xs hover:text-foreground">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Widget>
        </div>
      </GridLayout>
    </div>
  );
};
