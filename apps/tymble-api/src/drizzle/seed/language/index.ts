import { languageTable } from '@repo/db';
import { SeedDatabase } from '../utils/getSeedDatabase.utils';

const DEFAULT_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    emoji: '🇬🇧',
  },
  {
    code: 'fr',
    name: 'French',
    emoji: '🇫🇷',
  },
] satisfies (typeof languageTable.$inferInsert)[];

export const seedLanguages = async (db: SeedDatabase) => {
  await db.insert(languageTable).values(DEFAULT_LANGUAGES);
  console.log('🌐 Languages seeded!');
};
