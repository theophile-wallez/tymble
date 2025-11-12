// src/stocks/dto/get-history.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetHistoryDto {
  @IsString() ticker!: string;

  @IsOptional()
  @IsString()
  period?: string; // e.g. "1mo", "6mo", "1y"

  @IsOptional()
  @IsIn(['1d', '1wk', '1mo'])
  interval?: '1d' | '1wk' | '1mo';
}
