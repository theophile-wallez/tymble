import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarRail } from '@/ui/sidebar';

export const DefaultLayout = () => (
  <SidebarProvider>
    <SidebarRail />
    <AppSidebar />
    <SidebarInset>
      <section className="relative size-full">
        <header className="absolute top-0 left-0 h-header-height w-full bg-sidebar" />
        <section className="scrollbar-thin size-full overflow-auto pt-header-height">
          <Outlet />
        </section>
      </section>
    </SidebarInset>
  </SidebarProvider>
);
