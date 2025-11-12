import { IsIn, IsOptional, IsString } from 'class-validator';
import { ChartOptions } from 'yahoo-finance2/modules/chart';

export class GetChartDto {
  @IsString() ticker!: string;

  @IsOptional()
  @IsString()
  period1?: ChartOptions['period1'];

  @IsOptional()
  @IsString()
  period2?: ChartOptions['period2'];

  @IsOptional()
  @IsIn([
    '1m',
    '2m',
    '5m',
    '15m',
    '30m',
    '60m',
    '90m',
    '1h',
    '1d',
    '5d',
    '1wk',
    '1mo',
    '3mo',
  ])
  interval?: ChartOptions['interval'];
}
