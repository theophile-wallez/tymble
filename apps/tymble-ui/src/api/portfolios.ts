import { createPortfolioSchema, deletePortfolioSchema } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

// Re-export types from @tymble/schemas for convenience
export type {
  Asset,
  Instrument,
  Portfolio,
  PortfolioWithAssets,
} from '@tymble/schemas';

// Import types for use in this file
import type {
  CreatePortfolio,
  Portfolio,
  PortfolioWithAssets,
} from '@tymble/schemas';

export const fetchPortfolios = () => apiRequest<Portfolio[]>('/portfolio');

export const fetchPortfolio = (id: string) =>
  apiRequest<PortfolioWithAssets>(`/portfolio/${id}`);

export const createPortfolio = (data: CreatePortfolio['dto']) =>
  apiRequest('/portfolio', {
    method: 'POST',
    body: data,
    bodySchema: createPortfolioSchema.dto,
    schema: createPortfolioSchema.res,
  });

export const deletePortfolio = (id: string) =>
  apiRequest<{ id: string }>(`/portfolio/${id}`, {
    method: 'DELETE',
    schema: deletePortfolioSchema.res,
  });
