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

export function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include', // Important: send cookies with the request
  });
}

export async function fetchUser(): Promise<LoginResponse['user']> {
  const response = await apiRequest<LoginResponse['user']>('/user/profile');
  return response;
}
