import { Controller, Get, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import { GetScreenerQueryDto, GetScreenerResDto } from './dto/get.screener.dto';
import { GetChartQueryDto, GetChartResDto } from './dto/get-chart.dto';
import { StocksService } from './stocks.service';
@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get('quote')
  getQuote(@Query('ticker') ticker: string) {
    return this.stockService.getQuote(ticker);
  }

  @Get('quote-summary')
  getQuoteSummary(@Query('ticker') ticker: string) {
    return this.stockService.getQuoteLogo(ticker);
  }

  @Get('profile')
  getProfile(@Query('ticker') ticker: string) {
    return this.stockService.getCompanyProfile(ticker);
  }

  @Get('chart')
  @ZodResponse({ type: GetChartResDto })
  getHistory(@Query() query: GetChartQueryDto) {
    return this.stockService.getChart(
      query.ticker,
      query.interval,
      query.period1,
      query.period2
    );
  }

  @Get('screener')
  @ZodResponse({ type: GetScreenerResDto })
  async getScreener(@Query() query: GetScreenerQueryDto) {
    return await this.stockService.getScreener(query.scrIds);
  }

  @Get('insights')
  getInsights(@Query('symbol') symbol: string) {
    return this.stockService.getInsights(symbol);
  }

  @Get('search')
  searchTickersByName(@Query('name') name: string) {
    return this.stockService.searchTickersByName(name);
  }
}
