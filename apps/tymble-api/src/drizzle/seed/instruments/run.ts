/**
 * Standalone script to seed MSCI World instruments
 * Run with: bun run src/drizzle/seed/instruments/run.ts
 */
import { getSeedDatabase } from '../utils/getSeedDatabase.utils';
import { seedInstruments } from './index';

async function main() {
  const db = getSeedDatabase();
  await seedInstruments(db);
  process.exit(0);
}

main();
