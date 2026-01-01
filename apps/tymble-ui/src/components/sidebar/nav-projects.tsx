'use client';

import {
  Delete01Icon,
  Folder01Icon,
  Forward01Icon,
  MoreHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { Link } from '@tanstack/react-router';
import { useTranslation } from '@/hooks/use-translation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Icon, type IconType } from '@/ui/icon';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/sidebar';

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: IconType;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('sidebar.projects')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <Icon icon={item.icon} />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <Icon icon={MoreHorizontalIcon} />
                  <span className="sr-only">{t('sidebar.more')}</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? 'end' : 'start'}
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
              >
                <DropdownMenuItem>
                  <Icon className="text-muted-foreground" icon={Folder01Icon} />
                  <span>{t('sidebar.viewProject')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon
                    className="text-muted-foreground"
                    icon={Forward01Icon}
                  />
                  <span>{t('sidebar.shareProject')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icon className="text-muted-foreground" icon={Delete01Icon} />
                  <span>{t('sidebar.deleteProject')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <Icon
              className="text-sidebar-foreground/70"
              icon={MoreHorizontalIcon}
            />
            <span>{t('sidebar.more')}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
