import {
  type Dashboard,
  WIDGET_MIN_SIZES,
} from '../dashboard/dashboard-schema';

export const mockDashboardData: Dashboard = {
  id: 'dashboard-001',
  name: 'Main Dashboard',
  items: [
    // Stats Widgets
    {
      id: 'stats-1',
      layout: {
        i: 'stats-1',
        x: 0,
        y: 0,
        w: 3,
        h: 4,
        ...WIDGET_MIN_SIZES.stats,
      },
      content: {
        type: 'stats',
        data: { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
      },
      transparent: true,
    },
    {
      id: 'stats-2',
      layout: {
        i: 'stats-2',
        x: 3,
        y: 0,
        w: 3,
        h: 4,
        ...WIDGET_MIN_SIZES.stats,
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
        x: 6,
        y: 0,
        w: 3,
        h: 4,
        ...WIDGET_MIN_SIZES.stats,
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
        x: 9,
        y: 0,
        w: 3,
        h: 4,
        ...WIDGET_MIN_SIZES.stats,
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
        y: 4,
        w: 8,
        h: 9,
        ...WIDGET_MIN_SIZES.revenue,
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
        x: 8,
        y: 4,
        w: 4,
        h: 9,
        ...WIDGET_MIN_SIZES.activity,
      },
      content: {
        type: 'activity',
      },
    },
    // Tasks Widget
    {
      id: 'tasks',
      layout: {
        i: 'tasks',
        x: 0,
        y: 13,
        w: 8,
        h: 8,
        ...WIDGET_MIN_SIZES.tasks,
      },
      content: {
        type: 'tasks',
        data: {
          tasks: [
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
      },
    },
    // Traffic Widget
    {
      id: 'traffic',
      layout: {
        i: 'traffic',
        x: 8,
        y: 13,
        w: 4,
        h: 8,
        ...WIDGET_MIN_SIZES.traffic,
      },
      content: {
        type: 'traffic',
      },
    },
    // Text Widget
    {
      id: 'text-1',
      layout: {
        i: 'text-1',
        x: 0,
        y: 21,
        w: 12,
        h: 6,
        ...WIDGET_MIN_SIZES.text,
      },
      content: {
        type: 'text',
        data: {
          content:
            '<p>This is a <strong>text widget</strong>. You can edit this content when in edit mode.</p><ul><li>Item 1</li><li>Item 2</li></ul>',
        },
      },
    },
  ],
};
