import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { yahooFinanceProvider } from './yahoo-finance.provider';

@Module({
  providers: [StocksService, yahooFinanceProvider],
  exports: [StocksService],
  controllers: [StocksController],
})
export class StocksModule {}
