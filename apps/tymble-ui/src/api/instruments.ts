import { searchInstrumentSchema } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const searchStocks = (name: string) =>
  apiRequest('/instrument/search', {
    query: {
      name,
    },
    schema: searchInstrumentSchema.res,
    querySchema: searchInstrumentSchema.query,
  });
