import { getChartQuerySchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetChartQueryDto extends createZodDto(getChartQuerySchema.dto) {}
export class GetChartResDto extends createZodDto(getChartQuerySchema.res) {}
