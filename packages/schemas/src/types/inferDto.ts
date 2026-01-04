import type z from 'zod';
import type { DTOStructure } from './dto.structure';

export type InferDto<TSchema extends DTOStructure> = OmitNever<{
  dto: TSchema['dto'] extends z.ZodType ? z.infer<TSchema['dto']> : never;
  params: TSchema['params'] extends z.ZodType
    ? z.infer<TSchema['params']>
    : never;
  query: TSchema['query'] extends z.ZodType ? z.infer<TSchema['query']> : never;
  res: z.infer<TSchema['res']>;
}>;

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
