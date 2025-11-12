import { Injectable, Logger } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import type { ChartOptions } from 'yahoo-finance2/modules/chart';
import type { SearchResult } from 'yahoo-finance2/modules/search';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  private readonly yf = new YahooFinance({
    validation: {
      logErrors: true,
      logOptionsErrors: true,
    },
    logger: {
      info: this.logger.log,
      warn: this.logger.warn,
      error: this.logger.error,
      debug: this.logger.debug,
      dir: this.logger.debug,
    },
  });

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
    interval: ChartOptions['interval'],
    period1: ChartOptions['period1'] = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ),
    period2: ChartOptions['period2'] = new Date(Date.now())
  ) {
    console.log('🍏 period2', period2);

    console.log('🍤 period1', period1);

    console.log('🦄 interval', interval);

    console.log('🍅 ticker', ticker);

    const chart = await this.yf.chart(ticker, {
      interval,
      period1,
      period2,
      return: 'object',
    });
    return chart;
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
