import { createZodDto } from 'nestjs-zod';
import { createLocalUserSchema } from './create-user.dto';

const updateUserSchema = createLocalUserSchema.partial();

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
