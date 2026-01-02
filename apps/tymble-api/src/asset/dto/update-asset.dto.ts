import { updateAssetSchema } from '@tymble/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateAssetDto extends createZodDto(updateAssetSchema.dto) {}
