// src/stocks/stocks.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { GetScreenerDto } from './dto/get.screener.dto';
import { GetChartDto } from './dto/get-history.dto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly svc: StocksService) {}

  @Get('quote')
  getQuote(@Query('ticker') ticker: string) {
    return this.svc.getQuote(ticker);
  }

  @Get('quote-summary')
  getQuoteSummary(@Query('ticker') ticker: string) {
    return this.svc.getQuoteLogo(ticker);
  }

  @Get('profile')
  getProfile(@Query('ticker') ticker: string) {
    return this.svc.getCompanyProfile(ticker);
  }

  @Get('chart')
  getHistory(@Query() query: GetChartDto) {
    return this.svc.getChart(
      query.ticker,
      query.interval,
      query.period1,
      query.period2
    );
  }

  @Get('screener')
  getScreener(@Query() query: GetScreenerDto) {
    console.log('query: ', query);
    return this.svc.getScreener(query.scrIds);
  }

  @Get('insights')
  getInsights(@Query('symbol') symbol: string) {
    return this.svc.getInsights(symbol);
  }

  @Get('search')
  searchTickersByName(@Query('name') name: string) {
    return this.svc.searchTickersByName(name);
  }
}
