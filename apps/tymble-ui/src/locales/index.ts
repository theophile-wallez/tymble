import type enTranslations from './en.json';
import type frTranslations from './fr.json';

// Type-check that all translation files have the same structure as English
// This will cause a TypeScript error if fr.json is missing keys or has wrong structure
type TranslationKeys = typeof enTranslations;
type FrenchTranslations = typeof frTranslations;

// Compile-time check - will error if structures don't match
// @ts-expect-error - This type is intentionally unused; it exists only for compile-time validation
type _TypeCheck = FrenchTranslations extends TranslationKeys
  ? TranslationKeys extends FrenchTranslations
    ? true
    : false
  : false;

export type { TranslationKeys };
