import { createFileRoute, redirect } from '@tanstack/react-router';
import { authQueryOptions } from '@/hooks/use-auth';
import { DefaultLayout } from '@/layouts/default.layout';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(authQueryOptions);
    } catch {
      throw redirect({ to: '/login' });
    }
  },
  component: DefaultLayout,
});
