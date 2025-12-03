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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/ui/sidebar';

// This is sample data.
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
      plan: 'Enterprise',
    },
    {
      name: 'Tymble',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Tymble',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Portfolio',
      url: '#',
      icon: ChartNoAxesCombined,
      isActive: true,
      items: [
        {
          title: 'Stocks & Founds',
          url: '#',
        },
        {
          title: 'Savings accounts',
          url: '#',
        },
        {
          title: 'Other assets',
          url: '#',
        },
        {
          title: 'Checking accounts',
          url: '#',
        },
        {
          title: 'Crypto',
          url: '#',
        },
        {
          title: 'Euro funds',
          url: '#',
        },
        {
          title: 'Loans',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      // items: [
      //   {
      //     title: 'Genesis',
      //     url: '#',
      //   },
      //   {
      //     title: 'Explorer',
      //     url: '#',
      //   },
      //   {
      //     title: 'Quantum',
      //     url: '#',
      //   },
      // ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: MapIcon,
    },
  ],
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => (
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
