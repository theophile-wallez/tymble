import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [DrizzleModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
