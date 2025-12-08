import { useState } from 'react';
import 'react-grid-layout/css/styles.css';
import { ActivityWidget } from '../widgets/charts/activity-widget';
import { RevenueWidget } from '../widgets/charts/revenue-widget';
import { TrafficWidget } from '../widgets/charts/traffic-widget';
import { Widget } from '../widgets/widget';
import { DashboardGrid } from './dashboard-grid';
import { type DashboardItem, mockDashboardData } from './dashboard-schema';

type DashboardProps = {
  isEditing?: boolean;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Done':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
  }
};

const renderWidget = (item: DashboardItem, isEditing: boolean) => {
  switch (item.content.type) {
    case 'stats':
      return (
        <Widget isEditing={isEditing} title={item.content.data.label}>
          <p className="font-bold text-2xl">{item.content.data.value}</p>
          <p className="text-muted-foreground text-xs">
            <span className="text-green-500">{item.content.data.change}</span>{' '}
            from last month
          </p>
        </Widget>
      );
    case 'revenue':
      return <RevenueWidget isEditing={isEditing} />;
    case 'activity':
      return <ActivityWidget isEditing={isEditing} />;
    case 'traffic':
      return <TrafficWidget isEditing={isEditing} />;
    case 'tasks':
      return (
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
              {item.content.data.tasks.map((task) => (
                <div
                  className="grid grid-cols-4 items-center gap-4 rounded-md bg-muted/50 p-2 text-sm"
                  key={task.id}
                >
                  <span className="truncate font-medium">{task.title}</span>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs ${getPriorityColor(
                      task.priority
                    )}`}
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
      );
    default:
      return null;
  }
};

export const Dashboard = ({ isEditing = false }: DashboardProps) => {
  const [layout, setLayout] = useState(
    mockDashboardData.items.map((item) => item.layout)
  );

  return (
    <DashboardGrid
      isEditing={isEditing}
      layout={layout}
      onLayoutChange={setLayout}
    >
      {mockDashboardData.items.map((item) => (
        <div key={item.id}>{renderWidget(item, isEditing)}</div>
      ))}
    </DashboardGrid>
  );
};
