// Import types for use in this file
import type { CreatePortfolio } from '@tymble/schemas';
import {
  createPortfolioSchema,
  deletePortfolioSchema,
  getPortfolioSchema,
  getPortfoliosSchema,
} from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const fetchUserPortfolios = () =>
  apiRequest('/portfolio', {
    schema: getPortfoliosSchema.res,
  });

export const fetchPortfolio = (id: string) =>
  apiRequest(`/portfolio/${id}`, {
    schema: getPortfolioSchema.res,
  });

export const createPortfolio = (data: CreatePortfolio['dto']) =>
  apiRequest('/portfolio', {
    method: 'POST',
    body: data,
    dtoSchema: createPortfolioSchema.dto,
    schema: createPortfolioSchema.res,
  });

export const deletePortfolio = (id: string) =>
  apiRequest<{ id: string }>(`/portfolio/${id}`, {
    method: 'DELETE',
    schema: deletePortfolioSchema.res,
  });
