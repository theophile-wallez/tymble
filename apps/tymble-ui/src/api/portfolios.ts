import type { CreatePortfolio } from '@tymble/schemas';
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

export type CreatePortfolioRequest = CreatePortfolio['dto'];

export const fetchPortfolios = () => apiRequest<Portfolio[]>('/portfolio');

export const fetchPortfolio = (id: string) =>
  apiRequest<PortfolioWithAssets>(`/portfolio/${id}`);

export const createPortfolio = (data: CreatePortfolioRequest) =>
  apiRequest<Portfolio>('/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deletePortfolio = (id: string) =>
  apiRequest<{ id: string }>(`/portfolio/${id}`, {
    method: 'DELETE',
  });

// Stock search
export type StockSearchResult = {
  symbol: string;
  shortname: string;
  longname: string;
  exchDisp: string;
  typeDisp: string;
};

export const searchStocks = (name: string) =>
  apiRequest<{ quotes: StockSearchResult[] }>(
    `/stocks/search?name=${encodeURIComponent(name)}`
  );
