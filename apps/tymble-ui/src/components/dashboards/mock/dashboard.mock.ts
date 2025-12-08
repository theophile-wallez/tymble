import type { Dashboard } from '../dashboard/dashboard-schema';

export const mockDashboardData: Dashboard = {
  id: 'dashboard-001',
  name: 'Main Dashboard',
  items: [
    // Text Widget
    {
      id: 'text-1',
      transparent: true,
      layout: {
        i: 'text-1',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        minW: 3,
        minH: 2,
      },
      content: {
        type: 'text',
        data: {
          content:
            '<h1>Hello Théophile 👋</h1><p>Welcome to your main dashboard<p/>',
        },
      },
    },
    // Traffic Widget
    {
      id: 'traffic',
      layout: {
        i: 'traffic',
        x: 8,
        y: 0,
        w: 4,
        h: 9,
        minW: 3,
        minH: 6,
      },
      content: {
        type: 'traffic',
      },
    },
    // Stats Widgets
    {
      id: 'stats-1',
      layout: {
        i: 'stats-1',
        x: 0,
        y: 3,
        w: 4,
        h: 6,
        minW: 2,
        minH: 2,
      },
      content: {
        type: 'stats',
        data: { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
      },
    },
    {
      id: 'stats-2',
      layout: {
        i: 'stats-2',
        x: 8,
        y: 14,
        w: 4,
        h: 4,
        minW: 2,
        minH: 2,
      },
      content: {
        type: 'stats',
        data: { label: 'Subscriptions', value: '+2350', change: '+180.1%' },
      },
    },
    {
      id: 'stats-3',
      layout: {
        i: 'stats-3',
        x: 10,
        y: 9,
        w: 2,
        h: 5,
        minW: 2,
        minH: 2,
      },
      content: {
        type: 'stats',
        data: { label: 'Sales', value: '+12,234', change: '+19%' },
      },
    },
    {
      id: 'stats-4',
      layout: {
        i: 'stats-4',
        x: 8,
        y: 9,
        w: 2,
        h: 5,
        minW: 2,
        minH: 2,
      },
      content: {
        type: 'stats',
        data: { label: 'Active Now', value: '+573', change: '+201' },
      },
    },
    // Revenue Widget
    {
      id: 'revenue',
      layout: {
        i: 'revenue',
        x: 0,
        y: 9,
        w: 8,
        h: 9,
        minW: 4,
        minH: 6,
      },
      content: {
        type: 'revenue',
        config: { viewMode: 'monthly' },
      },
    },
    // Activity Widget
    {
      id: 'activity',
      layout: {
        i: 'activity',
        x: 4,
        y: 0,
        w: 4,
        h: 9,
        minW: 3,
        minH: 6,
      },
      content: {
        type: 'activity',
      },
    },
    // Tasks Table Widget
    {
      id: 'tasks',
      layout: {
        i: 'tasks',
        x: 0,
        y: 18,
        w: 12,
        h: 8,
        minW: 4,
        minH: 4,
      },
      content: {
        type: 'table',
        data: {
          columns: [
            { id: 'title', header: 'Task', accessorKey: 'title' },
            {
              id: 'status',
              header: 'Status',
              accessorKey: 'status',
              variant: 'badge',
              badgeColors: {
                Done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                'In Progress':
                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                Pending:
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
              },
            },
            {
              id: 'priority',
              header: 'Priority',
              accessorKey: 'priority',
              variant: 'badge',
              badgeColors: {
                High: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                Medium:
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                Low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
              },
            },
          ],
          rows: [
            {
              id: 't1',
              title: 'Review pull requests',
              status: 'In Progress',
              priority: 'High',
            },
            {
              id: 't2',
              title: 'Update documentation',
              status: 'Pending',
              priority: 'Medium',
            },
            {
              id: 't3',
              title: 'Fix authentication bug',
              status: 'Done',
              priority: 'High',
            },
            {
              id: 't4',
              title: 'Design new landing page',
              status: 'In Progress',
              priority: 'Low',
            },
            {
              id: 't5',
              title: 'Optimize database queries',
              status: 'In Progress',
              priority: 'High',
            },
            {
              id: 't6',
              title: 'Create marketing assets',
              status: 'Pending',
              priority: 'Low',
            },
          ],
        },
        config: {
          title: 'Tasks',
          description: 'Your current tasks',
        },
      },
    },
  ],
};
