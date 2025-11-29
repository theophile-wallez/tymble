import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as schema from '@repo/db';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}
  create(userId: string, createPortfolioDto: CreatePortfolioDto) {
    this.logger.log(
      `Creating a new portfolio with name: "${createPortfolioDto.name}" for userId: "${createPortfolioDto.userId}"`
    );

    if (userId !== createPortfolioDto.userId) {
      throw new BadRequestException('User ID mismatch');
    }

    return this.db
      .insert(schema.portfoliosTable)
      .values(createPortfolioDto)
      .returning();
  }

  findAllByUserId(userId: string) {
    this.logger.log(`Finding all portfolios for user with id ${userId}`);
    return this.db
      .select()
      .from(schema.portfoliosTable)
      .where(eq(schema.portfoliosTable.userId, userId));
  }

  findOne(id: string) {
    this.logger.log(`Finding portfolio with id ${id}`);
    return this.db.query.portfoliosTable.findFirst({
      where: eq(schema.portfoliosTable.id, id),
      with: {
        assets: true,
      },
      extras: {},
    });
  }

  update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    this.logger.log(`Updating portfolio with id ${id}`);
    return this.db
      .update(schema.portfoliosTable)
      .set({ ...updatePortfolioDto, updatedAt: new Date().toISOString() })
      .where(eq(schema.portfoliosTable.id, id))
      .returning({
        id: schema.portfoliosTable.id,
      });
  }

  remove(id: string) {
    this.logger.log(`Removing portfolio with id ${id}`);
    return this.db
      .delete(schema.portfoliosTable)
      .where(eq(schema.portfoliosTable.id, id))
      .returning({
        id: schema.portfoliosTable.id,
      });
  }
}
