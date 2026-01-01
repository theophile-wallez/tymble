import {
  BookOpen01Icon,
  Briefcase01Icon,
  ChartBarLineIcon,
  ChartLineData01Icon,
  Image01Icon,
  KeyframeIcon,
  MapsLocation01Icon,
  PieChartIcon,
  SettingsIcon,
} from '@hugeicons/core-free-icons';
import type * as React from 'react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavProjects } from '@/components/sidebar/nav-projects';
import { NavUser } from '@/components/sidebar/nav-user';
import { useTranslation } from '@/hooks/use-translation';
import { Icon, type IconType } from '@/ui/icon';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/ui/sidebar';

export type NavItem = {
  title: string;
  url: string;
  icon?: IconType;
  items?: NavItem[];
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation();

  const data = {
    navMain: [
      {
        title: t('navigation.portfolio.title'),
        url: '/portfolio',
        icon: ChartBarLineIcon,
        isActive: true,
        items: [
          {
            title: t('navigation.portfolio.stocksAndFunds'),
            url: '/portfolio/stocks-and-funds',
          },
          {
            title: t('navigation.portfolio.savingsAccounts'),
            url: '/portfolio/savings-accounts',
          },
          {
            title: t('navigation.portfolio.otherAssets'),
            url: '/portfolio/other-assets',
          },
          {
            title: t('navigation.portfolio.checkingAccounts'),
            url: '/portfolio/checking-accounts',
          },
          {
            title: t('navigation.portfolio.crypto'),
            url: '/portfolio/crypto',
          },
          {
            title: t('navigation.portfolio.euroFunds'),
            url: '/portfolio/euro-funds',
          },
          {
            title: t('navigation.portfolio.loans'),
            url: '/portfolio/loans',
          },
        ],
      },
      {
        title: t('navigation.dashboards.title'),
        url: '/dashboards',
        icon: ChartLineData01Icon,
      },
      {
        title: t('navigation.manage.title'),
        url: '/manage',
        icon: Briefcase01Icon,
      },
      {
        title: t('navigation.documentation.title'),
        url: '/documentation',
        icon: BookOpen01Icon,
        items: [
          {
            title: t('navigation.documentation.introduction'),
            url: '/documentation/introduction',
          },
          {
            title: t('navigation.documentation.getStarted'),
            url: '/documentation/get-started',
          },
          {
            title: t('navigation.documentation.tutorials'),
            url: '/documentation/tutorials',
          },
          {
            title: t('navigation.documentation.changelog'),
            url: '/documentation/changelog',
          },
        ],
      },
      {
        title: t('navigation.settingsMenu.title'),
        url: '/settings',
        icon: SettingsIcon,
        items: [
          {
            title: t('navigation.settingsMenu.general'),
            url: '/settings/general',
          },
          {
            title: t('navigation.settingsMenu.team'),
            url: '/settings/team',
          },
          {
            title: t('navigation.settingsMenu.billing'),
            url: '/settings/billing',
          },
          {
            title: t('navigation.settingsMenu.limits'),
            url: '/settings/limits',
          },
        ],
      },
    ],
    projects: [
      {
        name: t('projects.designEngineering'),
        url: '#',
        icon: KeyframeIcon,
      },
      {
        name: t('projects.salesAndMarketing'),
        url: '#',
        icon: PieChartIcon,
      },
      {
        name: t('projects.travel'),
        url: '#',
        icon: MapsLocation01Icon,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-header-height flex-row items-center gap-4 p-4">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-background text-primary">
          <Icon className="size-4" icon={Image01Icon} />
        </div>
        <div className="grid flex-1 text-left text-normal leading-tight">
          <span className="truncate font-medium">Tymble</span>
          {/* <span className="truncate text-xs">Portfolio</span> */}
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
