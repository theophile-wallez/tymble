import { type CreateAsset, createAssetSchema } from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const createAsset = (data: CreateAsset['dto']) =>
  apiRequest('/asset', {
    method: 'POST',
    body: data,
    dtoSchema: createAssetSchema.dto,
    schema: createAssetSchema.res,
  });
