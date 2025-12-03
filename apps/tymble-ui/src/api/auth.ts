import { apiRequest } from '@/lib/api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
  };
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  bio: string | null;
  isSuperuser: boolean;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  countryCode: string | null;
  theme: string;
  language: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
};

export const loginUser = (credentials: LoginRequest) => {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include', // Important: send cookies with the request
  });
};

export const fetchUser = () => apiRequest<User>('/user/profile');
