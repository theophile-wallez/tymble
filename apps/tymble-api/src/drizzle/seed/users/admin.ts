import { usersTable } from '@repo/db/index';
import * as d from 'drizzle-orm';
import { type SeedDatabase } from '../utils/getDatabase.utils';

export const seeAdminUser = async (db: SeedDatabase) => {
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(d.eq(usersTable.email, 'admin@tymble.com'))
    .limit(1);

  if (existingUser.length > 0) {
    console.log('🛡️  Admin user already exists!');
    return;
  }

  console.log('🛡️  Admin user does not exist, creating it...');

  const adminUser = {
    firstName: 'Tymble',
    lastName: 'Admin',
    email: 'admin@tymble.com',
    isSuperuser: true,
    bio: 'The super admin of Tymble.',
  } as const satisfies typeof usersTable.$inferInsert;

  await db.insert(usersTable).values(adminUser);
  console.log('🛡️  Admin user created!');
};
