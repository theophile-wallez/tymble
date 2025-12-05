import type z from 'zod';
import type { DTOStructure } from './dto.structure';

export type InferDto<TSchema extends DTOStructure> = {
  dto: z.infer<TSchema['dto']>;
  res: z.infer<TSchema['res']>;
};
