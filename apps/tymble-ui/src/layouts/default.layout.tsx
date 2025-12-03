import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarRail } from '@/ui/sidebar';

export const DefaultLayout = () => (
  <SidebarProvider>
    <SidebarRail />
    <AppSidebar />
    <SidebarInset>
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
);
