import { usersTable } from '@repo/db/index';
import { type SeedDatabase } from '../utils/getSeedDatabase.utils';

export const seedAdminUser = async (db: SeedDatabase) => {
  const adminUser = {
    firstName: 'Tymble',
    lastName: 'Admin',
    email: 'admin@tymble.com',
    isSuperuser: true,
    bio: 'The super admin of Tymble.',
    language: 'en',
    theme: 'dark',
  } as const satisfies typeof usersTable.$inferInsert;

  await db
    .insert(usersTable)
    .values(adminUser)
    .onConflictDoNothing({ target: usersTable.email })
    .returning({ email: usersTable.email });
  console.log('🛡️  Admin user created!');
};
