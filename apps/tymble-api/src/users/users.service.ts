import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as schema from '@repo/db';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { HandleErrors } from '@/decorators/handle-errors.decorator';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  @HandleErrors()
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    const [user] = await this.db
      .insert(schema.usersTable)
      .values(createUserDto)
      .returning({
        id: schema.usersTable.id,
      });
    return user;
  }

  findAll() {
    return this.db.query.usersTable.findMany({
      orderBy: (users, { desc }) => desc(users.createdAt),
    });
  }

  async findOne(id: number) {
    const user = await this.db.query.usersTable.findFirst({
      where: eq(schema.usersTable.id, id),
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const [user] = await this.db
      .update(schema.usersTable)
      .set({ ...updateUserDto, updatedAt: new Date().toISOString() })
      .where(eq(schema.usersTable.id, id))
      .returning();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(schema.usersTable)
      .where(eq(schema.usersTable.id, id))
      .returning();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
}
