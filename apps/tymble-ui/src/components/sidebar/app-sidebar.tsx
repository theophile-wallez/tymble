import {
  BookOpen,
  ChartArea,
  ChartNoAxesCombined,
  Frame,
  GalleryVerticalEnd,
  type LucideIcon,
  MapIcon,
  PieChart,
  Settings2,
} from 'lucide-react';
import type * as React from 'react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavProjects } from '@/components/sidebar/nav-projects';
import { NavUser } from '@/components/sidebar/nav-user';
import { useTranslation } from '@/hooks/use-translation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/ui/sidebar';

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation();

  // Data structure using translations
  const data = {
    navMain: [
      {
        title: t('navigation.portfolio.title'),
        url: '#',
        icon: ChartNoAxesCombined,
        isActive: true,
        items: [
          {
            title: t('navigation.portfolio.stocksAndFunds'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.savingsAccounts'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.otherAssets'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.checkingAccounts'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.crypto'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.euroFunds'),
            url: '#',
          },
          {
            title: t('navigation.portfolio.loans'),
            url: '#',
          },
        ],
      },
      {
        title: t('navigation.dashboards.title'),
        url: '#',
        icon: ChartArea,
      },
      {
        title: t('navigation.documentation.title'),
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: t('navigation.documentation.introduction'),
            url: '#',
          },
          {
            title: t('navigation.documentation.getStarted'),
            url: '#',
          },
          {
            title: t('navigation.documentation.tutorials'),
            url: '#',
          },
          {
            title: t('navigation.documentation.changelog'),
            url: '#',
          },
        ],
      },
      {
        title: t('navigation.settingsMenu.title'),
        url: '#',
        icon: Settings2,
        items: [
          {
            title: t('navigation.settingsMenu.general'),
            url: '#',
          },
          {
            title: t('navigation.settingsMenu.team'),
            url: '#',
          },
          {
            title: t('navigation.settingsMenu.billing'),
            url: '#',
          },
          {
            title: t('navigation.settingsMenu.limits'),
            url: '#',
          },
        ],
      },
    ],
    projects: [
      {
        name: t('projects.designEngineering'),
        url: '#',
        icon: Frame,
      },
      {
        name: t('projects.salesAndMarketing'),
        url: '#',
        icon: PieChart,
      },
      {
        name: t('projects.travel'),
        url: '#',
        icon: MapIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-header-height flex-row items-center gap-4 border-border border-b p-4">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">Tymble</span>
          <span className="truncate text-xs">Portfolio</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
};
