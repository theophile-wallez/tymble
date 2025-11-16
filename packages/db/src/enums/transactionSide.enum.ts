import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const transactionSides = ['buy', 'sell'] as const;

export const transactionSideEnum = pgEnum('transaction_side', transactionSides);

export type TransactionSide = (typeof transactionSides)[number];
export const transactionSideSchema = z.enum(transactionSides);
