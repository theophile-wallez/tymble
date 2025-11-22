import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const iconType = ['lib', 'emoji', 'url'] as const;

export const iconTypeEnum = pgEnum('theme', iconType);

export type IconType = (typeof iconType)[number];
export const iconTypeSchema = z.enum(iconType);
