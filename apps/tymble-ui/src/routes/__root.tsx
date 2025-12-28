import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { I18nProvider } from '@/contexts/i18n-context';

type MyRouterContext = {
  queryClient: QueryClient;
};

const RootLayout = () => (
  <I18nProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster />
      {/* <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools /> */}
    </ThemeProvider>
  </I18nProvider>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});
