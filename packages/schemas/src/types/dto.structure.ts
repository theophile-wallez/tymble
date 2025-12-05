// t is a zod schema representing the DTO structure
// r is a zod schema representing the response structure

import type z from 'zod';

export type DTOStructure<
  T extends z.ZodType = z.ZodType,
  R extends z.ZodType = z.ZodType,
> = {
  dto: T;
  res: R;
};
