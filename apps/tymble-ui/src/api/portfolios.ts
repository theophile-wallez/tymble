import { apiRequest } from '@/lib/api';

export type Instrument = {
  id: string;
  symbol: string;
  name: string;
  type: string;
  exchange: string | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  instrumentId: string;
  portfolioId: string;
  quantity: string;
  averagePrice: string;
  lastFees: string;
  lastTaxes: string;
  createdAt: string;
  updatedAt: string;
  instrument?: Instrument;
};

export type Portfolio = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  description: string | null;
  name: string;
  iconId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioWithAssets = Portfolio & {
  assets: Asset[];
};

export type CreatePortfolioRequest = {
  name: string;
  type: string;
  provider: string;
  description?: string;
};

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
  apiRequest<{ quotes: StockSearchResult[] }>(`/stocks/search?name=${encodeURIComponent(name)}`);
