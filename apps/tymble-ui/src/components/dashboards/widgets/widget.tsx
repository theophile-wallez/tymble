import type { DashboardItem } from '../dashboard/dashboard-schema';
import { ActivityWidget } from './charts/activity-widget';
import { RevenueWidget } from './charts/revenue-widget';
import { SegmentDistributionWidget } from './charts/segment-distribution-widget';
import { TrafficWidget } from './charts/traffic-widget';
import { TableWidget } from './table-widget';
import { TextWidget } from './text-widget';
import { WalletWidget } from './wallet-widget';
import { WidgetLayout } from './widget-layout';

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

export const Widget = ({
  item,
  isEditing,
}: {
  item: DashboardItem;
  isEditing: boolean;
}) => {
  switch (item.content.type) {
    case 'stats':
      return (
        <WidgetLayout
          isEditing={isEditing}
          title={item.content.data.label}
          transparent={item.transparent}
        >
          <p className="font-bold text-2xl">{item.content.data.value}</p>
          <p className="text-muted-foreground text-xs">
            <span className="text-green-500">{item.content.data.change}</span>{' '}
            from last month
          </p>
        </WidgetLayout>
      );
    case 'revenue':
      return (
        <RevenueWidget isEditing={isEditing} transparent={item.transparent} />
      );
    case 'activity':
      return (
        <ActivityWidget isEditing={isEditing} transparent={item.transparent} />
      );
    case 'traffic':
      return (
        <TrafficWidget isEditing={isEditing} transparent={item.transparent} />
      );
    case 'text':
      return (
        <TextWidget
          content={item.content.data.content}
          isEditing={isEditing}
          transparent={item.transparent}
        />
      );
    case 'wallet':
      return (
        <WalletWidget
          amount={item.content.config?.amount}
          fundingAmount={item.content.config?.fundingAmount}
          isEditing={isEditing}
          subAmount={item.content.config?.subAmount}
          totalLabel={item.content.config?.totalLabel}
        />
      );
    case 'table':
      return (
        <TableWidget
          columns={item.content.data.columns}
          description={item.content.config?.description}
          isEditing={isEditing}
          rows={item.content.data.rows}
          title={item.content.config?.title}
          transparent={item.transparent}
        />
      );
    case 'segmentDistribution':
      return (
        <SegmentDistributionWidget
          data={item.content.data?.segments}
          description={item.content.config?.description}
          isEditing={isEditing}
          title={item.content.config?.title}
          transparent={item.transparent}
        />
      );
    case 'tasks':
      return (
        <WidgetLayout
          description="Your current tasks"
          isEditing={isEditing}
          title="Tasks"
          transparent={item.transparent}
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
        </WidgetLayout>
      );
    default:
      return null;
  }
};
