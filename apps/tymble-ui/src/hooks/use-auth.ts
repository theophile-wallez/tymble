import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/api/auth';

export const authQueryOptions = {
  queryKey: ['user'],
  queryFn: fetchUser,
  retry: false,
};

export function useAuth() {
  return useQuery(authQueryOptions);
}
