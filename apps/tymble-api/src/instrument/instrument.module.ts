import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { yahooFinanceProvider } from '@/stocks/yahoo-finance.provider';
import { InstrumentController } from './instrument.controller';
import { InstrumentService } from './instrument.service';

@Module({
  imports: [DrizzleModule],
  controllers: [InstrumentController],
  providers: [InstrumentService, yahooFinanceProvider],
  exports: [InstrumentService],
})
export class InstrumentModule {}
