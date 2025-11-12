import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
@Module({
  imports: [DrizzleModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, StocksController],
  providers: [AppService, StocksService],
})
export class AppModule {}
