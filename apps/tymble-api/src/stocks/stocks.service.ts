// src/stocks/stocks.service.ts

import { Injectable } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import type {
  SearchResult,
  SearchOptions as YFSearchOptions,
} from 'yahoo-finance2/modules/search';

@Injectable()
export class StocksService {
  async getQuote(ticker: string) {
    const yf = new YahooFinance({
      validation: {
        logErrors: true,
      },
    });
    const quote = await yf.quote(ticker);
    return {
      ticker,
      longName: quote.longName ?? quote.shortName,
      exchange: quote.fullExchangeName,
      currency: quote.currency,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE,
      dividendYield: quote.trailingAnnualDividendYield,
      beta: quote.beta,
      updated: new Date().toISOString(),
    };
  }

  async getCompanyProfile(ticker: string) {
    const yf = new YahooFinance({
      validation: {
        logErrors: true,
      },
    });
    const { price, assetProfile } = await yf.quoteSummary(ticker, {
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

  async getHistory(
    ticker: string,
    period = '1mo',
    interval: '1d' | '1wk' | '1mo' = '1d'
  ) {
    const yf = new YahooFinance({
      validation: {
        logErrors: true,
      },
    });
    const rows = await yf.historical(ticker, {
      period1: period,
      interval,
    });
    return rows.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      ticker,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }));
  }

  async searchTickersByName(name: string, options?: YFSearchOptions) {
    const yf = new YahooFinance({
      validation: {
        logErrors: true,
      },
    });
    const res = await yf.search(name, options);
    const quotes: SearchResult['quotes'] = res?.quotes ?? [];
    return quotes.map((quote) => ({
      ticker: String(quote.symbol),
      shortName: quote.shortname ?? quote.shortName,
      longName: quote.longname ?? quote.longName,
      exchange: quote.exchDisp ?? quote.exchange,
      type: quote.quoteType,
      currency: quote.currency,
    }));
  }
}
