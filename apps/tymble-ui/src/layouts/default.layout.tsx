import { Outlet } from '@tanstack/react-router';
import { Header } from '@/components/header/header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarRail } from '@/ui/sidebar';

export const DefaultLayout = () => (
  <SidebarProvider>
    <SidebarRail />
    <AppSidebar />
    <SidebarInset>
      <section className="relative size-full overflow-hidden">
        <Header />
        <section className="scrollbar-thin size-full overflow-auto pt-header-height">
          <Outlet />
        </section>
      </section>
    </SidebarInset>
  </SidebarProvider>
);
