import type { InstrumentType } from '@tymble/schemas';

type InstrumentInfo = {
  label: string;
  description: string;
};

export const INSTRUMENT_TYPE_TO_INFO_MAP = {
  equity: {
    label: 'Equity',
    description: 'A security representing ownership in a company.',
  },
  bond: {
    label: 'Bond',
    description: 'A security representing a loan to a company or government.',
  },
  etf: {
    label: 'ETF',
    description:
      'An exchange-traded fund that tracks a basket of stocks or other assets.',
  },
  crypto: {
    label: 'Crypto',
    description:
      'A digital currency that uses cryptography to secure and verify transactions.',
  },
  index: {
    label: 'Index',
    description:
      'A basket of stocks or other assets that are used to track a market or sector.',
  },
  future: {
    label: 'Future',
    description: 'A contract to buy or sell an asset at a future date.',
  },
  option: {
    label: 'Option',
    description: 'A contract to buy or sell an asset at a future date.',
  },
  money_market: {
    label: 'Money Market',
    description:
      'A short-term investment that is typically held for a few days or weeks.',
  },
  currency: {
    label: 'Currency',
    description: 'A currency is a system of money in general use in a country.',
  },
} as const satisfies Record<InstrumentType, InstrumentInfo>;

export const INSTRUMENT_TYPES = Object.entries(INSTRUMENT_TYPE_TO_INFO_MAP).map(
  ([value, info]) => ({
    value,
    label: info.label,
  })
);
