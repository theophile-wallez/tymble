import { Logger, type Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import YahooFinance from 'yahoo-finance2';

export const yahooFinanceProvider: Provider = {
  provide: 'YAHOO_FINANCE',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const logger = new Logger('YahooFinance');

    const logErrors = config.get<boolean>('YF_LOG_ERRORS') ?? true;
    const logOptionsErrors =
      config.get<boolean>('YF_LOG_OPTIONS_ERRORS') ?? true;

    return new YahooFinance({
      validation: {
        logErrors,
        logOptionsErrors,
      },
      logger: {
        info: logger.log,
        warn: logger.warn,
        error: logger.error,
        debug: logger.debug,
        dir: logger.debug,
      },
    });
  },
};

export type YahooFinanceType = InstanceType<typeof YahooFinance>;
