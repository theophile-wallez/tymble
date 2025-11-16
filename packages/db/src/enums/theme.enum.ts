import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const themes = ['light', 'dark', 'system'] as const;

export const themeEnum = pgEnum('theme', themes);

export type Theme = (typeof themes)[number];
export const themeSchema = z.enum(themes);
