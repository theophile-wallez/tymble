import {
  getUserSchema,
  type Login,
  loginSchema,
  type UpdateUser,
  updateUserSchema,
} from '@tymble/schemas';
import { apiRequest } from '@/lib/api';

export const loginUser = (credentials: Login['dto']) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
    bodySchema: loginSchema.dto,
    schema: loginSchema.res,
  });

export const fetchUser = () =>
  apiRequest('/user/profile', {
    schema: getUserSchema.res,
  });

export const updateUser = (data: UpdateUser['dto']) =>
  apiRequest('/user/profile', {
    method: 'PATCH',
    body: data,
    bodySchema: updateUserSchema.dto,
    schema: updateUserSchema.res,
  });
