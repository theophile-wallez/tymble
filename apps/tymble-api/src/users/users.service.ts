import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as schema from '@repo/db';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { HandleErrors } from '@/decorators/handle-errors.decorator';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { CreateLocalUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  @HandleErrors()
  async createLocalUser(dto: CreateLocalUserDto) {
    this.logger.log(`Creating user with email: ${dto.email}`);
    const userId = await this.db.transaction(async (tx) => {
      const { password, ...userDto } = dto;

      const [user] = await tx
        .insert(schema.usersTable)
        .values(userDto)
        .returning({
          id: schema.usersTable.id,
          email: schema.usersTable.email,
        });

      const passwordHash = await bcrypt.hash(password, 10);
      await tx.insert(schema.authsTable).values({
        userId: user.id,
        provider: 'local',
        providerAccountId: user.email,
        passwordHash,
      });

      return user.id;
    });

    this.logger.log(`Created user with ID: ${userId}`);
    return userId;
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
