import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import type { TranslationKey } from '@/locales/translation-keys';

export type Language = 'en' | 'fr';

type Translations = typeof enTranslations;

const translations: Record<Language, Translations> = {
  en: enTranslations,
  fr: frTranslations,
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = 'tymble-language';

// Helper function to get nested value from object using dot notation
function getNestedValue(obj: unknown, path: TranslationKey): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path as string; // Return the key itself if not found
    }
  }

  return typeof current === 'string' ? current : (path as string);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored === 'en' || stored === 'fr' ? stored : 'en') as Language;
  });

  // Persist language changes to localStorage
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Translation function with nested key support
  const t = useCallback(
    (key: TranslationKey): string =>
      getNestedValue(translations[language], key),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
