import { type CreatePortfolio, searchInstrumentSchema } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

// Re-export types from @tymble/schemas for convenience
export type {
  Asset,
  Instrument,
  Portfolio,
  PortfolioWithAssets,
} from '@tymble/schemas';

// Import types for use in this file
import type { Portfolio, PortfolioWithAssets } from '@tymble/schemas';
import type z from 'zod';

export const fetchPortfolios = () => apiRequest<Portfolio[]>('/portfolio');

export const fetchPortfolio = (id: string) =>
  apiRequest<PortfolioWithAssets>(`/portfolio/${id}`);

export const createPortfolio = (data: CreatePortfolio['dto']) =>
  apiRequest<CreatePortfolio['res']>('/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deletePortfolio = (id: string) =>
  apiRequest<{ id: string }>(`/portfolio/${id}`, {
    method: 'DELETE',
  });

// Stock search
// TODO: Use shared types from @tymble/schemas
export type StockSearchResult = {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
  isLocalData: boolean;
  metadata: unknown;
};

export const searchStocks = (name: string) =>
  apiRequest<z.infer<typeof searchInstrumentSchema.res>>(
    `/instrument/search?name=${encodeURIComponent(name)}`,
    {
      schema: searchInstrumentSchema.res,
    }
  );
