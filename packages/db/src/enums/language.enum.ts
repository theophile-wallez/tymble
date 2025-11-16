import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const languageCodes = ['en', 'fr'] as const;

export const languageCodeEnum = pgEnum('language', languageCodes);

export type LanguageCode = (typeof languageCodes)[number];
export const languageCodeSchema = z.enum(languageCodes);
