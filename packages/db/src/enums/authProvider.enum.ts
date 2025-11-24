import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const authProviders = ['local', 'google'] as const;

export const authProviderEnum = pgEnum('auth_provider', authProviders);

export type AuthProvider = (typeof authProviderEnum.enumValues)[number];
export const authProviderSchema = z.enum(authProviders);
