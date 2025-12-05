import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as schema from '@tymble/db';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { TymbleException } from '@/errors/tymble.exception';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(userId: string, createPortfolioDto: CreatePortfolioDto) {
    try {
      this.logger.log(
        `Creating a new portfolio with name: "${createPortfolioDto.name}" for userId: "${userId}"`
      );

      const portfolioData = {
        ...createPortfolioDto,
        userId,
      };

      const result = await this.db
        .insert(schema.portfoliosTable)
        .values(portfolioData)
        .returning();

      return result[0];
    } catch (error: unknown) {
      throw new TymbleException(
        this.logger,
        `Failed to create portfolio for userId: "${userId}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
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
