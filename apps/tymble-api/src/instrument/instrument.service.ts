import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as schema from '@tymble/db';
import { type InstrumentType, instrumentInsertSchema } from '@tymble/db';
import {
  CreateInstrument,
  SearchedInstrument,
  SearchInstrument,
} from '@tymble/schemas';
import { eq, ilike, inArray, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SearchResult } from 'yahoo-finance2/modules/search';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { TymbleException } from '@/errors/tymble.exception';
import type { YahooFinanceType } from '@/stocks/yahoo-finance.provider';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

const MIN_DB_RESULTS = 10;
const SUGGESTED_SYMBOLS = [
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'NVDA',
  'BTC-USD',
  'ETH-USD',
  'META',
  'TSLA',
  'BRK.B',
  'JPM',
  'V',
  'SPY',
  'QQQ',
];

const YF_QUOTE_TYPE_TO_TYPE_MAP = {
  EQUITY: 'equity',
  ETF: 'etf',
  CRYPTOCURRENCY: 'crypto',
  MUTUALFUND: 'etf',
  INDEX: 'index',
  FUTURE: 'future',
  OPTION: 'option',
  MONEY_MARKET: 'money_market',
  CURRENCY: 'currency',
} as const satisfies Record<string, InstrumentType>;

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

    const pattern = `%${query}%` as const;

    return await this.db
      .select()
      .from(schema.instrumentTable)
      .where(
        or(
          ilike(schema.instrumentTable.symbol, pattern),
          ilike(schema.instrumentTable.name, pattern)
        )
      )
      .limit(10);
  }

  private async saveYahooFinanceInstruments(
    yahooQuotes: SearchResult['quotes']
  ): Promise<SearchInstrument['res']['instruments']> {
    const filteredQuotes = yahooQuotes.filter((quote) => {
      if (!quote.symbol) {
        this.logger.warn(`No symbol for quote: ${JSON.stringify(quote)}`);
        return false;
      }
      return true;
    });

    const newInstruments = filteredQuotes
      .map((quote) => {
        const type =
          YF_QUOTE_TYPE_TO_TYPE_MAP[
            quote.quoteType as keyof typeof YF_QUOTE_TYPE_TO_TYPE_MAP
          ];
        if (!type) {
          this.logger.warn(
            `Unknown quote type: ${quote.quoteType} for quote: ${quote.symbol}`,
            quote
          );
          return null;
        }

        const instrumentName = String(
          quote.name || quote.longname || quote.shortname || quote.symbol
        );

        if (['undefined', 'null'].includes(instrumentName)) {
          this.logger.warn(
            `No name for quote: ${JSON.stringify(quote, null, 2)}`
          );
          return null;
        }

        const {
          symbol,
          quoteType,
          exchange,
          exchDisp,
          sectorDisp,
          industryDisp,
          typeDisp: _typeDisp,
          ...metadata
        } = quote;

        // ? NOTE: We can be lazy on typing here because we're validating the data using Zod.
        const newInstrument = {
          symbol: symbol as string,
          name: instrumentName,
          type: YF_QUOTE_TYPE_TO_TYPE_MAP[
            quoteType as keyof typeof YF_QUOTE_TYPE_TO_TYPE_MAP
          ],
          exchange: (exchDisp ?? exchange) as string,
          sector: sectorDisp as string,
          industry: industryDisp as string,
          metadata,
        } satisfies CreateInstrument['dto'];

        const res = instrumentInsertSchema.safeParse(newInstrument);
        if (!res.success) {
          this.logger.warn(
            `Invalid instrument: ${newInstrument.symbol}`,
            res.error,
            JSON.stringify(newInstrument, null, 2)
          );
          return null;
        }

        this.logger.log(`Saving new instrument: ${newInstrument.symbol}`);
        return newInstrument;
      })
      .filter((instrument): instrument is NonNullable<typeof instrument> =>
        Boolean(instrument)
      );

    if (newInstruments.length === 0) {
      this.logger.log('No new instruments to save');
      return [];
    }

    try {
      const savedInstruments = await this.db
        .insert(schema.instrumentTable)
        .values(newInstruments)
        .onConflictDoNothing({ target: schema.instrumentTable.symbol })
        .returning();

      this.logger.log(
        `Saved ${savedInstruments.length} new instruments from Yahoo Finance with symbols: 
        ${savedInstruments.map((instrument) => instrument.symbol).join(', ')}`
      );
      return savedInstruments;
    } catch (error) {
      this.logger.warn('Failed to save some Yahoo Finance instruments', error);
      return [];
    }
  }

  private async getSuggestedInstruments(): Promise<SearchedInstrument[]> {
    const dbResults = await this.db
      .select()
      .from(schema.instrumentTable)
      .where(inArray(schema.instrumentTable.symbol, SUGGESTED_SYMBOLS));

    const instrumentBySymbolMap = new Map(
      dbResults.map((instrument) => [
        instrument.symbol.toUpperCase(),
        instrument,
      ])
    );

    return SUGGESTED_SYMBOLS.map((symbol) => {
      const instrument = instrumentBySymbolMap.get(symbol.toUpperCase());
      if (!instrument) {
        return null;
      }
      return {
        ...instrument,
        source: 'local',
      } as const;
    }).filter((instrument): instrument is NonNullable<typeof instrument> =>
      Boolean(instrument)
    );
  }

  async searchByName(name: string): Promise<SearchInstrument['res']> {
    const query = name?.trim() ?? '';
    if (query.length === 0) {
      this.logger.log('Returning suggested instruments');
      return { instruments: await this.getSuggestedInstruments() };
    }

    this.logger.log(`Searching for instruments by name: ${query}`);

    // First, search our database
    const dbInstruments = await this.fuzzySearch(query);
    this.logger.log(
      `Found ${dbInstruments.length} results in database for "${query}"`
    );

    if (dbInstruments.length >= MIN_DB_RESULTS) {
      return { instruments: dbInstruments };
    }

    // Otherwise, supplement with Yahoo Finance
    this.logger.log(`Supplementing with Yahoo Finance search for "${query}"`);

    let yfQuotes: SearchResult['quotes'] = [];
    try {
      // TODO: Handle metadata from Yahoo Finance
      // TODO: Use the stock service to search for instruments by symbol
      const yfRes = await this.yf.search(query, {
        enableCb: false,
        lang: 'en-US',
        newsCount: 0,
        enableFuzzyQuery: true,
        quotesCount: 10,
      });
      yfQuotes = yfRes?.quotes ?? [];
    } catch (error) {
      this.logger.warn(`Yahoo Finance search failed for "${name}"`, error);
      return { instruments: dbInstruments };
    }

    // Filter for quotes with symbols and mark as Yahoo Finance results
    const markedYfQuotes = yfQuotes.filter(
      (quote): quote is typeof quote & { symbol: string } =>
        'symbol' in quote && typeof quote.symbol === 'string'
    );

    // Combine results, DB first, then Yahoo Finance (excluding duplicates)
    const dbSymbols = new Set(dbInstruments.map((q) => q.symbol.toUpperCase()));
    const uniqueYfQuotes = markedYfQuotes.filter(
      (q) => !dbSymbols.has(q.symbol.toUpperCase())
    );

    // Save new Yahoo Finance instruments to our database
    if (uniqueYfQuotes.length > 0) {
      const newInstruments =
        await this.saveYahooFinanceInstruments(uniqueYfQuotes);
      return { instruments: [...dbInstruments, ...newInstruments] };
    }

    return { instruments: dbInstruments };
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
