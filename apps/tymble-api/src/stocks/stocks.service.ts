import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ChartOptions } from 'yahoo-finance2/modules/chart';
import { PredefinedScreenerModules } from 'yahoo-finance2/modules/screener';
import type { SearchResult } from 'yahoo-finance2/modules/search';
import { YAHOO_FINANCE } from './yahoo-finance.constants';
import type { YahooFinanceType } from './yahoo-finance.provider';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(@Inject(YAHOO_FINANCE) private readonly yf: YahooFinanceType) {}

  async getQuote(ticker: string) {
    const quote = await this.yf.quote(ticker);
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

    return chart;
  }

  async getScreener(scrIds: PredefinedScreenerModules) {
    return await this.yf.screener({
      scrIds,
    });
  }

  async getInsights(symbol: string) {
    this.logger.log(`Getting insights for ${symbol}`);
    return await this.yf.insights(symbol);
  }

  async searchTickersByName(name: string) {
    const res = await this.yf.search(
      name,
      {
        enableCb: false,
        lang: 'en-US',
        newsCount: 0,
        enableFuzzyQuery: true,
      },
      {
        validateResult: true,
      }
    );
    const quotes: SearchResult['quotes'] = res?.quotes ?? [];
    return quotes;
  }
}
