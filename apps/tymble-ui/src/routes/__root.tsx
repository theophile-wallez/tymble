import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';

type MyRouterContext = {
  queryClient: QueryClient;
};

const RootLayout = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Outlet />
    <Toaster />
    {/* <ReactQueryDevtools initialIsOpen={false} />
    <TanStackRouterDevtools /> */}
  </ThemeProvider>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});
