import { sql } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { authProviderEnum } from '../../enums/authProvider.enum';
import {
  drizzleRef,
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../../helpers';
import { usersTable } from './users.schema';

/**
 * Auths table.
 *
 * @description
 * This table stores the authentication methods of the users. An user can have multiple authentication methods.
 * For example, an user can have a password authentication and a Google OAuth authentication.
 */
export const authsTable = d.pgTable(
  'auths',
  {
    id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: drizzleRef(usersTable.id, 'cascade'),
    provider: authProviderEnum('provider').notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    passwordHash: d.text(),
    passwordLastChangedAt: d
      .timestamp({ mode: 'string' })
      .defaultNow()
      .notNull(),
    // oauthAccessToken: d.text('oauth_access_token'),
    // oauthRefreshToken: d.text('oauth_refresh_token'),
    // oauthExpiresAt: d.timestamp('oauth_expires_at', { mode: 'string' }),
    // oauthScope: d.text('oauth_scope'),
    // oauthIdToken: d.text('oauth_id_token'),
    ...withTimestamps,
  },
  (table) => [
    d
      .uniqueIndex('auths_provider_account_id_idx')
      .on(table.provider, table.providerAccountId),
    d.index('auth_user_id_idx').on(table.userId),
    d.check(
      'auths_password_hash_check',
      sql`(provider != 'local' OR password_hash IS NOT NULL)`
    ),
  ]
);

export type AuthInsert = typeof authsTable.$inferInsert;
export type AuthSelect = typeof authsTable.$inferSelect;

export const authSelectSchema = zodSelectGenerator(authsTable);
export const authInsertSchema = zodInsertGenerator(authsTable);
