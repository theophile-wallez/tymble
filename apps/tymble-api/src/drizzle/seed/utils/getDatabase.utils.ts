import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

export const getSeedDatabase = () => {
  const connectionString = process.env.DATABASE_URL ?? '';
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({
    client,
    casing: 'snake_case',
  });

  return db;
};

export type SeedDatabase = ReturnType<typeof getSeedDatabase>;
