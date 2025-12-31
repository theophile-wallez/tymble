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

// 6. Text Widget
const TextWidgetConfigSchema = z.object({
  type: z.literal('text'),
  data: z.object({
    content: z.string().default(''),
  }),
});

// 7. Table Widget
const TableColumnSchema = z.object({
  id: z.string(),
  header: z.string(),
  accessorKey: z.string(),
  variant: z.enum(['text', 'badge']).optional(),
  badgeColors: z.record(z.string(), z.string()).optional(),
});

const TableWidgetConfigSchema = z.object({
  type: z.literal('table'),
  data: z.object({
    columns: z.array(TableColumnSchema),
    rows: z.array(z.record(z.string(), z.unknown())),
  }),
  config: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

// 8. Segment Distribution Widget
const SegmentDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
  conversionRate: z.number().optional(),
  visitors: z.number().optional(),
});

const SegmentDistributionWidgetConfigSchema = z.object({
  type: z.literal('segmentDistribution'),
  config: z
    .object({
      title: z.string().optional(),
      totalRevenue: z.string().optional(),
      revenueChange: z.number().optional(),
      totalVisitors: z.string().optional(),
      visitorsChange: z.number().optional(),
    })
    .optional(),
  data: z.object({
    segments: z.array(SegmentDataSchema),
  }),
});

// --- Discriminated Union ---

export const WidgetContentSchema = z.discriminatedUnion('type', [
  StatsWidgetConfigSchema,
  RevenueWidgetConfigSchema,
  ActivityWidgetConfigSchema,
  TasksWidgetConfigSchema,
  TrafficWidgetConfigSchema,
  TextWidgetConfigSchema,
  TableWidgetConfigSchema,
  SegmentDistributionWidgetConfigSchema,
]);

// --- Dashboard Item Schema ---

export const DashboardItemSchema = z.object({
  id: z.string(), // Unique identifier for the widget instance
  layout: LayoutSchema,
  content: WidgetContentSchema,
  transparent: z.boolean().optional(),
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

export const WIDGET_MIN_SIZES: Record<
  WidgetType,
  { minW: number; minH: number }
> = {
  stats: { minW: 2, minH: 2 },
  revenue: { minW: 4, minH: 6 },
  activity: { minW: 3, minH: 6 },
  tasks: { minW: 4, minH: 6 },
  traffic: { minW: 3, minH: 6 },
  text: { minW: 3, minH: 2 },
  table: { minW: 4, minH: 4 },
  wallet: { minW: 4, minH: 4 },
  segmentDistribution: { minW: 4, minH: 5 },
};

// --- Mock Data ---
