import { seedInstruments } from './instruments';
// import { seedUsers } from './users';
import { getSeedDatabase } from './utils/getSeedDatabase.utils';

async function main() {
  const db = getSeedDatabase();
  // await seedUsers(db);
  await seedInstruments(db);
  process.exit(0);
}

main();
