import type { DTOStructure } from 'types/dto.structure';
import type z from 'zod';

export type InferDto<TSchema extends DTOStructure> = {
  dto: z.infer<TSchema['dto']>;
  res: z.infer<TSchema['res']>;
};
