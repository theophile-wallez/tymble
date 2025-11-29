import type { Request as ExpressRequest } from 'express';

export type GuardedRequest = ExpressRequest & {
  user: {
    id: number;
  };
};
