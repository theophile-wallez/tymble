import type { CreateAsset } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const createAsset = (data: CreateAsset['dto']) =>
  apiRequest<CreateAsset['res']>('/asset', {
    method: 'POST',
    body: JSON.stringify(data),
  });
