import { searchInstrumentSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchInstrumentQueryDTO extends createZodDto(
  searchInstrumentSchema.query
) {}

export class SearchInstrumentResponseDTO extends createZodDto(
  searchInstrumentSchema.res
) {}
