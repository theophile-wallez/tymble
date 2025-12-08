import { z } from 'zod';

// --- Shared Schemas ---

const LayoutSchema = z.object({
  i: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  minW: z.number().optional(),
  maxW: z.number().optional(),
  minH: z.number().optional(),
  maxH: z.number().optional(),
  static: z.boolean().optional(),
  isDraggable: z.boolean().optional(),
  isResizable: z.boolean().optional(),
});

// --- Widget Specific Schemas ---

// 1. Stats Widget
const StatsWidgetConfigSchema = z.object({
  type: z.literal('stats'),
  data: z.object({
    label: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.enum(['up', 'down', 'neutral']).optional(), // Added for future use
  }),
});

// 2. Revenue Widget
const RevenueWidgetConfigSchema = z.object({
  type: z.literal('revenue'),
  // Add specific config if needed, e.g., chart type, time range
  config: z
    .object({
      viewMode: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
    })
    .optional(),
});

// 3. Activity Widget
const ActivityWidgetConfigSchema = z.object({
  type: z.literal('activity'),
  config: z
    .object({
      limit: z.number().default(5),
    })
    .optional(),
});

// 4. Tasks Widget
const TaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['Done', 'In Progress', 'Pending']),
  priority: z.enum(['High', 'Medium', 'Low']),
});

const TasksWidgetConfigSchema = z.object({
  type: z.literal('tasks'),
  data: z.object({
    tasks: z.array(TaskItemSchema),
  }),
});

// 5. Traffic Widget
const TrafficWidgetConfigSchema = z.object({
  type: z.literal('traffic'),
  config: z
    .object({
      showLegend: z.boolean().default(true),
    })
    .optional(),
});

// --- Discriminated Union ---

export const WidgetContentSchema = z.discriminatedUnion('type', [
  StatsWidgetConfigSchema,
  RevenueWidgetConfigSchema,
  ActivityWidgetConfigSchema,
  TasksWidgetConfigSchema,
  TrafficWidgetConfigSchema,
]);

// --- Dashboard Item Schema ---

export const DashboardItemSchema = z.object({
  id: z.string(), // Unique identifier for the widget instance
  layout: LayoutSchema,
  content: WidgetContentSchema,
});

export const DashboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(DashboardItemSchema),
});

// --- Types ---

export type WidgetType = z.infer<typeof WidgetContentSchema>['type'];
export type WidgetContent = z.infer<typeof WidgetContentSchema>;
export type DashboardItem = z.infer<typeof DashboardItemSchema>;
export type Dashboard = z.infer<typeof DashboardSchema>;

// --- Mock Data ---

export const mockDashboardData: Dashboard = {
  id: 'dashboard-001',
  name: 'Main Dashboard',
  items: [
    // Stats Widgets
    {
      id: 'stats-1',
      layout: { i: 'stats-1', x: 0, y: 0, w: 3, h: 4 },
      content: {
        type: 'stats',
        data: { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
      },
    },
    {
      id: 'stats-2',
      layout: { i: 'stats-2', x: 3, y: 0, w: 3, h: 4 },
      content: {
        type: 'stats',
        data: { label: 'Subscriptions', value: '+2350', change: '+180.1%' },
      },
    },
    {
      id: 'stats-3',
      layout: { i: 'stats-3', x: 6, y: 0, w: 3, h: 4 },
      content: {
        type: 'stats',
        data: { label: 'Sales', value: '+12,234', change: '+19%' },
      },
    },
    {
      id: 'stats-4',
      layout: { i: 'stats-4', x: 9, y: 0, w: 3, h: 4 },
      content: {
        type: 'stats',
        data: { label: 'Active Now', value: '+573', change: '+201' },
      },
    },
    // Revenue Widget
    {
      id: 'revenue',
      layout: { i: 'revenue', x: 0, y: 4, w: 8, h: 9 },
      content: {
        type: 'revenue',
        config: { viewMode: 'monthly' },
      },
    },
    // Activity Widget
    {
      id: 'activity',
      layout: { i: 'activity', x: 8, y: 4, w: 4, h: 9 },
      content: {
        type: 'activity',
      },
    },
    // Tasks Widget
    {
      id: 'tasks',
      layout: { i: 'tasks', x: 0, y: 13, w: 8, h: 8 },
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
      layout: { i: 'traffic', x: 8, y: 13, w: 4, h: 8 },
      content: {
        type: 'traffic',
      },
    },
  ],
};
