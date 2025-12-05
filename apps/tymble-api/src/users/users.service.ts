import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as schema from '@tymble/db';
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
    try {
      const userId = await this.db.transaction(async (tx) => {
        const { password, passwordConfirmation: _, ...userDto } = dto;

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
    } catch (error) {
      const message = error instanceof Error ? error.cause : 'Unknown error';
      this.logger.error(
        `Failed to create user with email: ${dto.email}`,
        message
      );
      throw new HttpException('Failed to create user', 500);
    }
  }

  async findOne(id: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: eq(schema.usersTable.id, id),
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: eq(schema.usersTable.email, email),
      with: { auths: true },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

  async remove(id: string) {
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
