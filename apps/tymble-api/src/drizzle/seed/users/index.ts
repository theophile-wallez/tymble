import { SeedDatabase } from '../utils/getSeedDatabase.utils';
import { seedAdminUser } from './admin';
import { seedMockUsers } from './mock';

export const seedUsers = async (db: SeedDatabase) => {
  await seedAdminUser(db);
  await seedMockUsers(db);
};
