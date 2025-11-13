import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { yahooFinanceProvider } from './yahoo-finance.provider';
import { StocksController } from './stocks.controller';

@Module({
  providers: [StocksService, yahooFinanceProvider],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
