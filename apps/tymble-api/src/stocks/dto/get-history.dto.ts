import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ChartOptions } from 'yahoo-finance2/modules/chart';

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

const GetChartSchema = z.object({
  ticker: z.string(),
  period1: z.string().optional(),
  period2: z.string().optional(),
  interval: z.enum(intervals).optional(),
});

export class GetChartDto extends createZodDto(GetChartSchema) {}
