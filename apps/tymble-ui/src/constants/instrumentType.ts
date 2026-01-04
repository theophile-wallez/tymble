import type { InstrumentType } from '@tymble/schemas';

export const INSTRUMENT_TYPE_MAP = {
  equity: 'Equity',
  bond: 'Bond',
  etf: 'ETF',
  crypto: 'Crypto',
  index: 'Index',
  future: 'Future',
  option: 'Option',
  money_market: 'Money Market',
  currency: 'Currency',
} as const satisfies Record<InstrumentType, string>;

export const INSTRUMENT_TYPES = Object.entries(INSTRUMENT_TYPE_MAP).map(
  ([value, label]) => ({
    value,
    label,
  })
);
