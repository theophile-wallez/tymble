import type enTranslations from './en.json';

// Recursively build dot-notation paths for all keys in the translation object
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

// Generate all possible translation keys as a union type
export type TranslationKey = Join<
  PathsToStringProps<typeof enTranslations>,
  '.'
>;

// Example keys that will be available:
// 'common.language' | 'common.english' | 'auth.login.title' | 'navigation.portfolio.title' | etc.
