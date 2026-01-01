import {
  ArrowUpDownIcon,
  CheckmarkBadge01Icon,
  CreditCardIcon,
  Logout01Icon,
  Notification01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { IconLanguage } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { Language } from '@/contexts/i18n-context';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Icon } from '@/ui/icon';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/sidebar';

export function NavUser() {
  const { data: user } = useAuth();
  const { isMobile } = useSidebar();
  const { language, setLanguage, t } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('common.english') },
    { code: 'fr', label: t('common.french') },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  alt={user?.firstName}
                  src={user?.avatarUrl ?? ''}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.firstName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <Icon className="ml-auto size-4" icon={ArrowUpDownIcon} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={user?.firstName}
                    src={user?.avatarUrl ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon icon={SparklesIcon} />
                {t('user.upgradeToPro')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <Icon icon={CheckmarkBadge01Icon} />
                  {t('user.account')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon icon={CreditCardIcon} />
                {t('user.billing')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon icon={Notification01Icon} />
                {t('user.notifications')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {t('common.language')}
              </DropdownMenuLabel>
              {languages.map((lang) => (
                <DropdownMenuItem
                  className={language === lang.code ? 'bg-accent' : ''}
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                >
                  <IconLanguage className="size-4" />
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon={Logout01Icon} />
              {t('user.logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
