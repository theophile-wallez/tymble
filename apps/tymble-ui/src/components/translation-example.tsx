import { useTranslation } from '@/hooks/use-translation';

/**
 * Example component demonstrating typed translation keys with IntelliSense
 */
export function TranslationExample() {
  const { t } = useTranslation();

  // ✅ IntelliSense will show all available keys!
  // Try typing: t('
  // You'll see autocomplete for:
  // - 'common.language'
  // - 'common.english'
  // - 'auth.login.title'
  // - 'navigation.portfolio.title'
  // - 'sidebar.platform'
  // ... and all other 90+ keys!

  return (
    <div>
      <h1>{t('auth.login.title')}</h1>
      <p>{t('auth.login.emailPlaceholder')}</p>

      {/* TypeScript will error if you use an invalid key */}
      {/* <p>{t('invalid.key.here')}</p> */}
    </div>
  );
}
