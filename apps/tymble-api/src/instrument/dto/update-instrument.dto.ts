import { updateInstrumentSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateInstrumentDto extends createZodDto(
  updateInstrumentSchema.dto
) {}

export class UpdateInstrumentResponseDto extends createZodDto(
  updateInstrumentSchema.res
) {}
