import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';

type MyRouterContext = {
  queryClient: QueryClient;
};

const RootLayout = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Outlet />
    <Toaster />
    <ReactQueryDevtools initialIsOpen={false} />
    <TanStackRouterDevtools />
  </ThemeProvider>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});
