import { createAssetSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class CreateAssetDto extends createZodDto(z.any()) {}

export class CreateAssetResponseDto extends createZodDto(
  createAssetSchema.res
) {}
