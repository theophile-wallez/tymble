import { useEffect, useRef, useState } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { ActivityWidget } from '../widgets/charts/activity-widget';
import { RevenueWidget } from '../widgets/charts/revenue-widget';
import { TrafficWidget } from '../widgets/charts/traffic-widget';
import { ResizeHandle } from '../widgets/resize-handle';
import { Widget } from '../widgets/widget';

// Mock data for widgets
const statsData = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
  { label: 'Subscriptions', value: '+2350', change: '+180.1%' },
  { label: 'Sales', value: '+12,234', change: '+19%' },
  { label: 'Active Now', value: '+573', change: '+201' },
];

const tasksData = [
  { title: 'Review pull requests', status: 'In Progress', priority: 'High' },
  { title: 'Update documentation', status: 'Pending', priority: 'Medium' },
  { title: 'Fix authentication bug', status: 'Done', priority: 'High' },
  { title: 'Design new landing page', status: 'In Progress', priority: 'Low' },
  {
    title: 'Optimize database queries',
    status: 'In Progress',
    priority: 'High',
  },
  { title: 'Create marketing assets', status: 'Pending', priority: 'Low' },
];

// Initial layout configuration
const initialLayout: Layout[] = [
  { i: 'stats-1', x: 0, y: 0, w: 3, h: 4 },
  { i: 'stats-2', x: 3, y: 0, w: 3, h: 4 },
  { i: 'stats-3', x: 6, y: 0, w: 3, h: 4 },
  { i: 'stats-4', x: 9, y: 0, w: 3, h: 4 },
  { i: 'revenue', x: 0, y: 4, w: 8, h: 9 },
  { i: 'activity', x: 8, y: 4, w: 4, h: 9 },
  { i: 'tasks', x: 0, y: 13, w: 8, h: 8 },
  { i: 'traffic', x: 8, y: 13, w: 4, h: 8 },
];

type DashboardProps = {
  isEditing?: boolean;
};

export const Dashboard = ({ isEditing = false }: DashboardProps) => {
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
        isDraggable={isEditing}
        isResizable={isEditing}
        layout={layout}
        onLayoutChange={setLayout}
        resizeHandle={<ResizeHandle />}
        rowHeight={30}
        width={width}
      >
        {/* Stats Widgets */}
        {statsData.map((stat, index) => (
          <div key={`stats-${index + 1}`}>
            <Widget isEditing={isEditing} title={stat.label}>
              <p className="font-bold text-2xl">{stat.value}</p>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-500">{stat.change}</span> from last
                month
              </p>
            </Widget>
          </div>
        ))}

        {/* Revenue Widget */}
        <div key="revenue">
          <RevenueWidget isEditing={isEditing} />
        </div>

        {/* Activity Widget */}
        <div key="activity">
          <ActivityWidget isEditing={isEditing} />
        </div>

        {/* Tasks Widget */}
        <div key="tasks">
          <Widget
            description="Your current tasks"
            isEditing={isEditing}
            title="Tasks"
          >
            <div className="">
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
                    <button
                      className="text-muted-foreground text-xs hover:text-foreground"
                      type="button"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Widget>
        </div>

        {/* Traffic Widget */}
        <div key="traffic">
          <TrafficWidget isEditing={isEditing} />
        </div>
      </GridLayout>
    </div>
  );
};
