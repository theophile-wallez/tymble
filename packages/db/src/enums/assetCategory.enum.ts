import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const assetCategories = [
  'Investments',
  'Fonds euro',
  'Cryptos',
  'Other',
] as const;

export const assetCategoryEnum = pgEnum('asset_category', assetCategories);

export type AssetCategory = (typeof assetCategories)[number];
export const assetCategorySchema = z.enum(assetCategories);
