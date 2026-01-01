import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import type { InstrumentType } from '@tymble/db';
import * as schema from '@tymble/db';
import { eq, ilike, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { SearchResult } from 'yahoo-finance2/modules/search';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { TymbleException } from '@/errors/tymble.exception';
import type { YahooFinanceType } from '@/stocks/yahoo-finance.provider';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

const MIN_DB_RESULTS = 3;

const QUOTE_TYPE_MAP: Record<string, InstrumentType> = {
  EQUITY: 'stock',
  ETF: 'etf',
  CRYPTOCURRENCY: 'crypto',
  MUTUALFUND: 'etf',
  INDEX: 'stock',
  FUTURE: 'stock',
  OPTION: 'stock',
};

@Injectable()
export class InstrumentService {
  private readonly logger = new Logger(InstrumentService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject('YAHOO_FINANCE') private readonly yf: YahooFinanceType
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto) {
    try {
      this.logger.log(
        `Creating a new instrument with symbol: "${createInstrumentDto.symbol}"`
      );

      const result = await this.db
        .insert(schema.instrumentTable)
        .values(createInstrumentDto)
        .returning();

      return result[0];
    } catch (error: unknown) {
      throw new TymbleException(
        this.logger,
        `Failed to create instrument with symbol: "${createInstrumentDto.symbol}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  async findAll() {
    this.logger.log('Finding all instruments');
    return await this.db.select().from(schema.instrumentTable);
  }

  async fuzzySearch(query: string) {
    this.logger.log(`Fuzzy searching instruments for query: ${query}`);

    const pattern = `%${query}%`;

    return await this.db
      .select()
      .from(schema.instrumentTable)
      .where(
        or(
          ilike(schema.instrumentTable.symbol, pattern),
          ilike(schema.instrumentTable.name, pattern)
        )
      )
      .limit(5);
  }

  private async saveYahooFinanceInstruments(
    quotes: Array<{ symbol: string } & Record<string, unknown>>
  ) {
    if (quotes.length === 0) {
      return;
    }

    const instrumentsToInsert = quotes.map((quote) => ({
      symbol: quote.symbol,
      name:
        (quote.longname as string) ||
        (quote.shortname as string) ||
        (quote.name as string) ||
        quote.symbol,
      type:
        QUOTE_TYPE_MAP[(quote.quoteType as string) ?? ''] ?? ('stock' as const),
      exchange: (quote.exchange as string) ?? null,
      metadata: {
        source: 'yahoo' as const,
        lastSyncedAt: new Date().toISOString(),
      },
    }));

    try {
      await this.db
        .insert(schema.instrumentTable)
        .values(instrumentsToInsert)
        .onConflictDoNothing({ target: schema.instrumentTable.symbol });

      this.logger.log(
        `Saved ${quotes.length} new instruments from Yahoo Finance`
      );
    } catch (error) {
      this.logger.warn('Failed to save some Yahoo Finance instruments', error);
    }
  }

  async searchByName(name: string) {
    this.logger.log(`Searching for instruments by name: ${name}`);

    // First, search our database
    const dbResults = await this.fuzzySearch(name);
    this.logger.log(
      `Found ${dbResults.length} results in database for "${name}"`
    );

    // Map DB results to a consistent format
    // TODO: Type this
    const dbQuotes = dbResults.map((instrument) => ({
      symbol: instrument.symbol,
      name: instrument.name,
      type: instrument.type,
      exchange: instrument.exchange,
      isLocalData: false,
      metadata: instrument.metadata,
    }));

    // If we have enough results from DB, return them
    if (dbResults.length >= MIN_DB_RESULTS) {
      return { quotes: dbQuotes };
    }

    // Otherwise, supplement with Yahoo Finance
    this.logger.log(`Supplementing with Yahoo Finance search for "${name}"`);

    let yfQuotes: SearchResult['quotes'] = [];
    try {
      // TODO: Handle metadata from Yahoo Finance
      // TODO: Use the stock service to search for instruments by symbol
      const yfRes = await this.yf.search(name, {
        enableCb: false,
        lang: 'en-US',
        newsCount: 0,
        enableFuzzyQuery: true,
      });
      yfQuotes = yfRes?.quotes ?? [];
    } catch (error) {
      this.logger.warn(`Yahoo Finance search failed for "${name}"`, error);
      return { quotes: dbQuotes };
    }

    // Filter for quotes with symbols and mark as Yahoo Finance results
    const markedYfQuotes = yfQuotes
      .filter(
        (quote): quote is typeof quote & { symbol: string } =>
          'symbol' in quote && typeof quote.symbol === 'string'
      )
      .map((quote) => ({
        ...quote,
        isLocalData: true,
      }));

    // Combine results, DB first, then Yahoo Finance (excluding duplicates)
    const dbSymbols = new Set(dbQuotes.map((q) => q.symbol.toUpperCase()));
    const uniqueYfQuotes = markedYfQuotes.filter(
      (q) => !dbSymbols.has(q.symbol.toUpperCase())
    );

    // Save new Yahoo Finance instruments to our database
    await this.saveYahooFinanceInstruments(uniqueYfQuotes);

    return { quotes: [...dbQuotes, ...uniqueYfQuotes] };
  }

  async findOne(id: string) {
    this.logger.log(`Finding instrument with id ${id}`);
    const result = await this.db
      .select()
      .from(schema.instrumentTable)
      .where(eq(schema.instrumentTable.id, id));

    if (result.length === 0) {
      throw new TymbleException(
        this.logger,
        `Instrument with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result[0];
  }

  async findBySymbol(symbol: string) {
    this.logger.log(`Finding instrument with symbol ${symbol}`);
    const result = await this.db
      .select()
      .from(schema.instrumentTable)
      .where(eq(schema.instrumentTable.symbol, symbol));

    return result[0] || null;
  }

  async update(id: string, updateInstrumentDto: UpdateInstrumentDto) {
    this.logger.log(`Updating instrument with id ${id}`);

    try {
      const result = await this.db
        .update(schema.instrumentTable)
        .set({ ...updateInstrumentDto, updatedAt: new Date().toISOString() })
        .where(eq(schema.instrumentTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new TymbleException(
          this.logger,
          `Instrument with id "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }

      return result[0];
    } catch (error: unknown) {
      if (error instanceof TymbleException) {
        throw error;
      }
      throw new TymbleException(
        this.logger,
        `Failed to update instrument with id: "${id}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing instrument with id ${id}`);

    const result = await this.db
      .delete(schema.instrumentTable)
      .where(eq(schema.instrumentTable.id, id))
      .returning({ id: schema.instrumentTable.id });

    if (result.length === 0) {
      throw new TymbleException(
        this.logger,
        `Instrument with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result[0];
  }
}
