import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import type { ChartOptions } from 'yahoo-finance2/modules/chart';
import { PredefinedScreenerModules } from 'yahoo-finance2/modules/screener';
import type { SearchResult } from 'yahoo-finance2/modules/search';
import { TymbleException } from '@/errors/tymble.exception';
import { InstrumentService } from '@/instrument/instrument.service';
import type { YahooFinanceType } from './yahoo-finance.provider';

const HOST_REGEX = /^www\./;
const MIN_DB_RESULTS = 3;

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    @Inject('YAHOO_FINANCE') private readonly yf: YahooFinanceType,
    private readonly instrumentService: InstrumentService
  ) {}

  async getQuote(ticker: string) {
    return await this.yf.quote(ticker);
  }

  async getQuoteLogo(ticker: string) {
    const data = await this.yf.quoteSummary(ticker, {
      modules: 'all',
    });

    const website = data.assetProfile?.website;

    if (!website) {
      throw new Error(`No website found for ${ticker}`);
    }

    const domain = new URL(website).hostname.replace(HOST_REGEX, '');

    const params = new URLSearchParams();
    params.set('token', process.env.LOGO_DEV_PUBLIC_KEY ?? '');
    params.set('format', 'webp');
    return `https://img.logo.dev/${domain}?${params.toString()}`;
  }

  async getCompanyProfile(ticker: string) {
    const { price, assetProfile } = await this.yf.quoteSummary(ticker, {
      modules: ['price', 'assetProfile'],
    });

    return {
      ticker,
      longName: price?.longName ?? price?.shortName,
      sector: assetProfile?.sector,
      industry: assetProfile?.industry,
      country: assetProfile?.country,
      website: assetProfile?.website,
      summary: assetProfile?.longBusinessSummary,
      employees: assetProfile?.fullTimeEmployees,
    };
  }

  async getChart(
    ticker: string,
    interval: ChartOptions['interval'] = '1d',
    period1: ChartOptions['period1'] = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ),
    period2: ChartOptions['period2'] = new Date(Date.now())
  ) {
    const chart = await this.yf.chart(ticker, {
      interval,
      period1,
      period2,
      return: 'array',
      events: 'history',
    });
    // Convert Date objects to ISO strings for validation
    return {
      // ...chart,
      quotes: chart.quotes.map((quote) => ({
        ...quote,
        date:
          quote.date instanceof Date ? quote.date.toISOString() : quote.date,
      })),
    };
  }

  async getScreener(scrIds: PredefinedScreenerModules) {
    this.logger.log(`Getting screener for ${scrIds}`);
    try {
      return await this.yf.screener({
        scrIds,
      });
    } catch (error) {
      this.logger.error(`Error getting screener for ${scrIds}`, error);
      throw new HttpException(error, 500);
    }
  }

  async getInsights(symbol: string) {
    this.logger.log(`Getting insights for ${symbol}`);
    return await this.yf.insights(symbol);
  }

  async searchTickersByName(name: string) {
    try {
      // First, search our database
      const dbResults = await this.instrumentService.fuzzySearch(name);
      this.logger.log(
        `Found ${dbResults.length} results in database for "${name}"`
      );

      // Map DB results to match Yahoo Finance quote format
      const dbQuotes = dbResults.map((instrument) => ({
        symbol: instrument.symbol,
        shortname: instrument.name,
        longname: instrument.name,
        quoteType: instrument.type?.toUpperCase() ?? 'unknown',
        exchange: instrument.exchange ?? '',
        isYahooFinance: false,
        // Include metadata for additional info
        ...((instrument.metadata as Record<string, unknown>) ?? {}),
      }));

      // If we have enough results from DB, return them
      if (dbResults.length >= MIN_DB_RESULTS) {
        return { quotes: dbQuotes };
      }

      // Otherwise, supplement with Yahoo Finance
      this.logger.log(`Supplementing with Yahoo Finance search for "${name}"`);
      const yfRes = await this.yf.search(name, {
        enableCb: false,
        lang: 'en-US',
        newsCount: 0,
        enableFuzzyQuery: true,
      });
      const yfQuotes: SearchResult['quotes'] = yfRes?.quotes ?? [];

      // Filter for quotes with symbols and mark as Yahoo Finance results
      const quotesWithSymbol = yfQuotes.filter(
        (quote): quote is typeof quote & { symbol: string } =>
          'symbol' in quote && typeof quote.symbol === 'string'
      );
      const markedYfQuotes = quotesWithSymbol.map((quote) => ({
        ...quote,
        isYahooFinance: true,
      }));

      // Combine results, DB first, then Yahoo Finance (excluding duplicates)
      const dbSymbols = new Set(dbQuotes.map((q) => q.symbol.toUpperCase()));
      const uniqueYfQuotes = markedYfQuotes.filter(
        (q) => !dbSymbols.has(q.symbol.toUpperCase())
      );

      return { quotes: [...dbQuotes, ...uniqueYfQuotes] };
    } catch (error) {
      throw new TymbleException(
        this.logger,
        `Error searching tickers by name ${name}`,
        500,
        error
      );
    }
  }
}
