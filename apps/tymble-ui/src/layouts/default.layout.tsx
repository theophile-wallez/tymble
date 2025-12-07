import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarRail } from '@/ui/sidebar';

export const DefaultLayout = () => (
  <SidebarProvider>
    <SidebarRail />
    <AppSidebar />
    <SidebarInset className="h-screen overflow-hidden bg-main-background">
      <section className="relative flex h-full flex-1 flex-col overflow-hidden p-2 pl-0">
        <section className="min-h-0 flex-1 overflow-auto rounded-md border border-border bg-background">
          <Outlet />
        </section>
      </section>
    </SidebarInset>
  </SidebarProvider>
);
