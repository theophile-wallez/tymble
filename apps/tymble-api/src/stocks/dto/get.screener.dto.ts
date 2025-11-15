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

const GetScreenerSchema = z.object({
  scrIds: z.enum(screenerModules),
});

export class GetScreenerDto extends createZodDto(GetScreenerSchema) {}

const ScreenerResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export class ScreenerResponseDto extends createZodDto(ScreenerResponseSchema) {}
