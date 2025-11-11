import { SeedDatabase } from '../utils/getDatabase.utils';
import { seeAdminUser } from './admin';
import { seedMockUsers } from './mock';

export const seedUsers = async (db: SeedDatabase) => {
  await seeAdminUser(db);
  await seedMockUsers(db);
};
