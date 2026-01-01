import type { InstrumentMetadata } from '@tymble/db';
import * as schema from '@tymble/db';
import { eq } from 'drizzle-orm';
import YahooFinance from 'yahoo-finance2';
import type { SeedDatabase } from '../utils/getSeedDatabase.utils';
import { msciWorldSymbols } from './msci-world-symbols';

const yf = new YahooFinance();

// Rate limiting helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 2000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const is429 = error instanceof Error && error.message.includes('429');
      if (is429 && attempt < maxRetries - 1) {
        const waitTime = baseDelay * 2 ** attempt;
        console.log(`  ⏳ Rate limited, waiting ${waitTime / 1000}s...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

function mapQuoteTypeToInstrumentType(
  quoteType?: string
): 'stock' | 'bond' | 'etf' | 'crypto' {
  switch (quoteType?.toUpperCase()) {
    case 'ETF':
      return 'etf';
    case 'CRYPTOCURRENCY':
      return 'crypto';
    case 'MUTUALFUND':
    case 'BOND':
      return 'bond';
    default:
      return 'stock';
  }
}

async function fetchInstrumentData(symbol: string) {
  try {
    const data = await withRetry(() =>
      yf.quoteSummary(symbol, {
        modules: 'all',
      })
    );

    const price = data.price;
    const assetProfile = data.assetProfile;
    const quoteType = data.quoteType;

    if (!price?.shortName && !price?.longName) {
      console.warn(`  ⚠️  No name found for ${symbol}, skipping`);
      return null;
    }

    const metadata: InstrumentMetadata = {
      source: 'yahoo',
      sector: assetProfile?.sector ?? undefined,
      industry: assetProfile?.industry ?? undefined,
      country: assetProfile?.country ?? undefined,
      website: assetProfile?.website ?? undefined,
      marketCap: price?.marketCap ?? undefined,
      lastSyncedAt: new Date().toISOString(),
    };

    return {
      symbol: symbol.toUpperCase(),
      name: price?.longName ?? price?.shortName ?? symbol,
      type: mapQuoteTypeToInstrumentType(quoteType?.quoteType),
      exchange: price?.exchangeName ?? quoteType?.exchange ?? undefined,
      currency: price?.currency ?? undefined,
      metadata,
    };
  } catch (error) {
    console.error(
      `  ❌ Failed to fetch ${symbol}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function seedInstruments(db: SeedDatabase) {
  console.log('\n📈 Seeding MSCI World instruments...\n');

  const totalSymbols = msciWorldSymbols.length;
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < totalSymbols; i++) {
    const symbol = msciWorldSymbols[i];
    const progress = `[${i + 1}/${totalSymbols}]`;

    // Check if already exists
    const existing = await db
      .select({ id: schema.instrumentTable.id })
      .from(schema.instrumentTable)
      .where(eq(schema.instrumentTable.symbol, symbol.toUpperCase()))
      .limit(1);

    if (existing.length > 0) {
      console.log(`${progress} ⏭️  ${symbol} already exists, skipping`);
      skipped += 1;
      continue;
    }

    console.log(`${progress} 📥 Fetching ${symbol}...`);
    const instrumentData = await fetchInstrumentData(symbol);

    if (instrumentData) {
      try {
        await db.insert(schema.instrumentTable).values(instrumentData);
        console.log(`${progress} ✅ Inserted ${instrumentData.name}`);
        inserted += 1;
      } catch (error) {
        console.error(
          `${progress} ❌ Failed to insert ${symbol}:`,
          error instanceof Error ? error.message : error
        );
        failed += 1;
      }
    } else {
      failed += 1;
    }

    // Rate limiting: wait 2s between requests to avoid hitting Yahoo Finance limits
    if (i < totalSymbols - 1) {
      await delay(2000);
    }
  }

  console.log('\n📊 Seeding complete!');
  console.log(`   ✅ Inserted: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${totalSymbols}\n`);
}
