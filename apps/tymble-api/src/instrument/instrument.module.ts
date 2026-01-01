import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { InstrumentController } from './instrument.controller';
import { InstrumentService } from './instrument.service';

@Module({
  imports: [DrizzleModule],
  controllers: [InstrumentController],
  providers: [InstrumentService],
  exports: [InstrumentService],
})
export class InstrumentModule {}
