import type { DTOStructure, InferDto } from '@schemas/types';
import type { ChartOptions } from 'yahoo-finance2/modules/chart';
import { z } from 'zod';

const intervals = [
  '1m',
  '2m',
  '5m',
  '15m',
  '30m',
  '60m',
  '90m',
  '1h',
  '1d',
  '5d',
  '1wk',
  '1mo',
  '3mo',
] as const satisfies ChartOptions['interval'][];

const quoteSchema = z.object({
  date: z.iso.datetime(),
  open: z.number().nullable(),
  high: z.number().nullable(),
  low: z.number().nullable(),
  close: z.number().nullable(),
  volume: z.number().nullable(),
  adjclose: z.number().nullish(),
});

export const getChartQuerySchema = {
  dto: z.object({
    ticker: z.string(),
    period1: z.string().optional(),
    period2: z.string().optional(),
    interval: z.enum(intervals).optional(),
  }),
  res: z.object({
    quotes: quoteSchema.array(),
  }),
} satisfies DTOStructure;

export type GetChart = InferDto<typeof getChartQuerySchema>;
