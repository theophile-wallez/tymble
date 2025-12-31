/**
 * Re-export database types and schemas from @tymble/db
 * This allows consumers to only depend on @tymble/schemas
 */

// Schemas
export {
  assetInsertSchema,
  assetSelectSchema,
  assetsTable,
  assetUpdateSchema,
  instrumentInsertSchema,
  instrumentSelectSchema,
  instrumentTable,
  instrumentUpdateSchema,
  portfolioInsertSchema,
  portfolioSelectSchema,
  portfoliosTable,
  portfolioUpdateSchema,
} from '@tymble/db';

// Database types (with Date objects)
export type {
  AssetInsert,
  AssetSelect,
  AssetUpdate,
  InstrumentInsert,
  InstrumentSelect,
  InstrumentUpdate,
  PortfolioInsert,
  PortfolioSelect,
  PortfolioUpdate,
} from '@tymble/db';

/**
 * Utility type to convert Date properties to string (for JSON serialization)
 */
type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};

// API response types (with serialized dates as strings)
import type {
  AssetSelect,
  InstrumentSelect,
  PortfolioSelect,
} from '@tymble/db';

export type Portfolio = Serialized<PortfolioSelect>;
export type Instrument = Serialized<InstrumentSelect>;
export type Asset = Serialized<AssetSelect> & {
  instrument?: Instrument;
};
export type PortfolioWithAssets = Portfolio & {
  assets: Asset[];
};
