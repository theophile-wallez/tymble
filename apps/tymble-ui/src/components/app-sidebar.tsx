import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  Command,
  Frame,
  GalleryVerticalEnd,
  MapIcon,
  PieChart,
  Settings2,
} from 'lucide-react';
import type * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { useTranslation } from '@/hooks/use-translation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/ui/sidebar';

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation();

  // Data structure using translations
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Tymble',
        logo: GalleryVerticalEnd,
        plan: t('sidebar.enterprise'),
      },
      {
        name: 'Tymble',
        logo: AudioWaveform,
        plan: t('sidebar.startup'),
      },
      {
        name: 'Tymble',
        logo: Command,
        plan: t('sidebar.free'),
      },
    ],
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
        title: t('navigation.models.title'),
        url: '#',
        icon: Bot,
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
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
