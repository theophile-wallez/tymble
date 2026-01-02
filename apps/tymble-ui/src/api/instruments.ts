import { searchInstrumentSchema } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const searchStocks = (name: string) =>
  apiRequest('/instrument/search', {
    params: {
      name,
    },
    schema: searchInstrumentSchema.res,
    paramSchema: searchInstrumentSchema.dto,
  });
