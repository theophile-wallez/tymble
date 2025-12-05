import { userInsertSchema, usersTable } from '@tymble/db';
import { z } from 'zod';
import { SeedDatabase } from '../utils/getSeedDatabase.utils';

export const seedMockUsers = async (db: SeedDatabase) => {
  const mockarooKey = process.env.MOCKAROO_KEY;
  if (!mockarooKey) {
    throw new Error('MOCKAROO_KEY is not defined');
  }

  const mockUsersRes = await fetch(
    `https://my.api.mockaroo.com/tymble_mock.json?key=${mockarooKey}`
  );

  if (!mockUsersRes.ok) {
    throw new Error('Failed to fetch mock users');
  }

  const rawMockUsers = await mockUsersRes.json();

  const mockUsers = z.array(userInsertSchema).parse(rawMockUsers);

  const inserted = await db
    .insert(usersTable)
    .values(mockUsers)
    .onConflictDoNothing({ target: usersTable.email })
    .returning({ email: usersTable.email });

  console.log(
    `👨 Inserted ${inserted.length}/${mockUsers.length} new mock users`
  );
};
