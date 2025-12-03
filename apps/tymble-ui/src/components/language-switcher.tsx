import { IconLanguage } from '@tabler/icons-react';
import type { Language } from '@/contexts/i18n-context';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('common.english') },
    { code: 'fr', label: t('common.french') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <IconLanguage className="size-5" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            className={language === lang.code ? 'bg-accent' : ''}
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
