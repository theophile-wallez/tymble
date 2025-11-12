// src/stocks/stocks.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { GetHistoryDto } from './dto/get-history.dto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly svc: StocksService) {}

  @Get('quote')
  getQuote(@Query('ticker') ticker: string) {
    return this.svc.getQuote(ticker);
  }

  @Get('profile')
  getProfile(@Query('ticker') ticker: string) {
    return this.svc.getCompanyProfile(ticker);
  }

  @Get('history')
  getHistory(@Query() q: GetHistoryDto) {
    return this.svc.getHistory(q.ticker, q.period ?? '1mo', q.interval ?? '1d');
  }

  @Get('search')
  searchTickersByName(@Query('name') name: string) {
    return this.svc.searchTickersByName(name);
  }
}
