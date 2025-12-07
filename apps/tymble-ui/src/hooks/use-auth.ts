import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/api/auth';

export const authQueryOptions = {
  queryKey: ['user'],
  queryFn: fetchUser,
  retry: false,
  staleTime: 5 * 60 * 1000,
};

export function useAuth() {
  return useQuery(authQueryOptions);
}
