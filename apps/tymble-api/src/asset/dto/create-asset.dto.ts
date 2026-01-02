import { createAssetSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateAssetDto extends createZodDto(createAssetSchema.dto) {}

export class CreateAssetResponseDto extends createZodDto(
  createAssetSchema.res
) {}
