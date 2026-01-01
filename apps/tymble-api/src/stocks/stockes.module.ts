import { Module } from '@nestjs/common';
import { InstrumentModule } from '@/instrument/instrument.module';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { yahooFinanceProvider } from './yahoo-finance.provider';

@Module({
  imports: [InstrumentModule],
  providers: [StocksService, yahooFinanceProvider],
  exports: [StocksService],
  controllers: [StocksController],
})
export class StocksModule {}
