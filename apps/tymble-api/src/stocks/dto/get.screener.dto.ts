import { createZodDto } from 'nestjs-zod';
import * as screener from 'yahoo-finance2/modules/screener';
import { z } from 'zod';

const screenerModules = [
  'aggressive_small_caps',
  'conservative_foreign_funds',
  'day_gainers',
  'day_losers',
  'growth_technology_stocks',
  'high_yield_bond',
  'most_actives',
  'most_shorted_stocks',
  'portfolio_anchors',
  'small_cap_gainers',
  'solid_large_growth_funds',
  'solid_midcap_growth_funds',
  'top_mutual_funds',
  'undervalued_growth_stocks',
  'undervalued_large_caps',
] as const satisfies screener.PredefinedScreenerModules[];

const GetScreenerQuerySchema = z.object({
  scrIds: z
    .enum(screenerModules)
    .describe('The screener module ID to retrieve'),
});

export class GetScreenerQueryDto extends createZodDto(GetScreenerQuerySchema) {}

const GetScreenerResSchema = z
  .object({
    id: z.string().describe('Unique identifier for the screener'),
    title: z.string().describe('Display name of the screener'),
  })
  .strict();

export class GetScreenerResDto extends createZodDto(GetScreenerResSchema) {}
