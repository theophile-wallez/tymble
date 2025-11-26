import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { StocksModule } from './stocks/stockes.module';
import { UsersModule } from './users/users.module';
import { TransactionModule } from './transaction/transaction.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    DrizzleModule,
    StocksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    TransactionModule,
    PortfolioModule,
    AssetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
