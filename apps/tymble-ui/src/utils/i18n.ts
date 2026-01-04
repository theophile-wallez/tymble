import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import type { TranslationKey } from '@/locales/translation-keys';
import type { Language } from '@/contexts/i18n-context';

type Translations = typeof enTranslations;

const translations: Record<Language, Translations> = {
  en: enTranslations,
  fr: frTranslations,
};

const LANGUAGE_STORAGE_KEY = 'tymble-language';

function getNestedValue(obj: unknown, path: TranslationKey): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path as string;
    }
  }

  return typeof current === 'string' ? current : (path as string);
}

export function getLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return (stored === 'en' || stored === 'fr' ? stored : 'en') as Language;
}

export function t(key: TranslationKey, language: Language = getLanguage()) {
  return getNestedValue(translations[language], key);
}
