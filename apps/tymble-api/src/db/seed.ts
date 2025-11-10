import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { usersTable } from '@/db/schema';

const connectionString = process.env.DATABASE_URL ?? '';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function main() {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john@example.com',
  } as const satisfies typeof usersTable.$inferInsert;

  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');
}

main();
