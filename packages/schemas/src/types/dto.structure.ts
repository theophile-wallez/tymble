/** biome-ignore-all lint/suspicious/noExplicitAny: simple extends */

import type z from 'zod';

export type DTOStructure<
  T extends z.ZodType<any> = z.ZodType<unknown>,
  R extends z.ZodType<any> = z.ZodType<unknown>,
> = {
  dto: T;
  res: R;
};
