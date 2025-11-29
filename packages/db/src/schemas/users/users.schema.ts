import * as d from 'drizzle-orm/pg-core';
import z from 'zod';
import { languageCodeEnum, themeEnum } from '../../enums';
import {
  withTimestamps,
  zodInsertGenerator,
  zodSelectGenerator,
} from '../../helpers';

export const usersTable = d.pgTable(
  'users',
  {
    id: d.uuid().primaryKey().defaultRandom(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    firstName: d.varchar({ length: 255 }).notNull(),
    lastName: d.varchar().notNull(),
    birthdate: d.date({
      mode: 'string',
    }),
    bio: d.varchar(),
    isSuperuser: d.boolean().notNull().default(false),
    avatarUrl: d.varchar(),
    emailVerifiedAt: d.timestamp({ mode: 'string' }),
    countryCode: d.varchar({ length: 2 }),
    theme: themeEnum('theme').notNull().default('dark'),
    language: languageCodeEnum('language').notNull().default('en'),
    ...withTimestamps,
  },
  (table) => [d.index('users_email_idx').on(table.email)]
);

// check that date is after 1900-01-01 and before 13 years ago
const birthdateSchema = z.string().superRefine((dateString, ctx) => {
  const date = new Date(dateString);
  const minDate = new Date('1900-01-01');
  const now = new Date();
  const maxDate = new Date(
    now.getFullYear() - 13,
    now.getMonth(),
    now.getDate()
  );
  const parsedDate = z.date().safeParse(date); // will add issue if invalid date

  if (!parsedDate.success) {
    ctx.addIssue({
      code: 'custom',
      message: 'birthdate must be a valid date string',
    });
    return;
  }

  if (date > now) {
    ctx.addIssue({
      code: 'custom',
      message: 'birthdate cannot be in the future',
    });
    return;
  }

  if (date < minDate) {
    ctx.addIssue({
      code: 'custom',
      message: 'birthdate must be after 1900-01-01',
    });
  }
  if (date > maxDate) {
    ctx.addIssue({
      code: 'custom',
      message: 'birthdate must be at least 13 years ago',
    });
  }
});

export const userSelectSchema = zodSelectGenerator(usersTable);
export const userInsertSchema = zodInsertGenerator(usersTable, {
  email: z
    .email()
    .toLowerCase()
    .describe('User email address')
    .meta({ example: 'user@example.com' }),
  birthdate: birthdateSchema
    .optional()
    .describe('User birthdate in YYYY-MM-DD format')
    .meta({ example: 'YYYY-MM-DD' }),
  avatarUrl: z
    .httpUrl()
    .optional()
    .describe('URL of the user avatar')
    .meta({ example: 'https://example.com/avatar.png' }),
  firstName: (s) => s.describe("User's first name").meta({ example: 'John' }),
  lastName: (s) => s.describe("User's last name").meta({ example: 'Doe' }),
});

export const userUpdateSchema = userInsertSchema.partial();

export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
