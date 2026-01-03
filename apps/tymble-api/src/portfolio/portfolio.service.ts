import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as schema from '@tymble/db';
import { GetPortfolio, GetPortfolios } from '@tymble/schemas';
import { count, eq, getTableColumns } from 'drizzle-orm';
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

  async findAllByUserId(userId: string): Promise<GetPortfolios['res']> {
    this.logger.log(`Finding all portfolios for user with id ${userId}`);
    return await this.db
      .select({
        ...getTableColumns(schema.portfoliosTable),
        assetsCount: count(schema.assetsTable.id),
      })
      .from(schema.portfoliosTable)
      .leftJoin(
        schema.assetsTable,
        eq(schema.assetsTable.portfolioId, schema.portfoliosTable.id)
      )
      .where(eq(schema.portfoliosTable.userId, userId))
      .groupBy(schema.portfoliosTable.id);
  }

  async findOne(id: string): Promise<GetPortfolio['res']> {
    this.logger.log(`Finding portfolio with id ${id}`);
    const result = await this.db.query.portfoliosTable.findFirst({
      where: eq(schema.portfoliosTable.id, id),
      with: {
        assets: {
          with: {
            instrument: true,
          },
        },
      },
    });
    if (!result) {
      throw new TymbleException(
        this.logger,
        `Portfolio with id "${id}" not found`,
        HttpStatus.NOT_FOUND,
        null
      );
    }
    return result;
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
