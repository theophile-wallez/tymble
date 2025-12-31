import { apiRequest } from '@/lib/api';

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

export type CreatePortfolioRequest = {
  name: string;
  type: string;
  provider: string;
  description?: string;
};

export const fetchPortfolios = () => apiRequest<Portfolio[]>('/portfolio');

export const createPortfolio = (data: CreatePortfolioRequest) =>
  apiRequest<Portfolio>('/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
