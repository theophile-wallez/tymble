import type z from 'zod';

export const defineDto = <
  T extends z.ZodTypeAny,
  R extends z.ZodTypeAny,
  P extends z.ZodTypeAny,
  Q extends z.ZodRawShape,
>(
  schema: {
    res: R;
  } & AtLeastOne<{
    dto: T;
    params: P;
    query: z.ZodObject<ExactlyOneStringShape<Q>>;
  }>
) => schema;

type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
  }[Keys];

type ExactlyOneStringShape<T extends z.ZodRawShape> = {
  [K in keyof T]: {
    [P in K]: z.ZodString;
  } & {
    [P in Exclude<keyof T, K>]?: never;
  };
}[keyof T];

export type ZodObjectExactlyOneStringKey<Shape extends z.ZodRawShape> =
  z.ZodObject<ExactlyOneStringShape<Shape>>;
