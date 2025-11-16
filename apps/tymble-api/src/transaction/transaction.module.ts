import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DrizzleModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
