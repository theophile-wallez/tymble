import { userInsertSchema } from '@repo/db';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(userInsertSchema) {}
