import { createInstrumentSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateInstrumentDto extends createZodDto(
  createInstrumentSchema.dto
) {}

export class CreateInstrumentResponseDto extends createZodDto(
  createInstrumentSchema.res
) {}
