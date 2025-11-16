import { Inject, Injectable, Logger } from '@nestjs/common';
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
  create(createPortfolioDto: CreatePortfolioDto) {
    this.logger.log(
      `Creating a new portfolio with name: "${createPortfolioDto.name}" for userId: "${createPortfolioDto.userId}"`
    );
    this.db.insert(schema.portfolioTable).values(createPortfolioDto).returning({
      id: schema.portfolioTable.id,
    });
  }

  findAllByUserId(userId: number) {
    this.logger.log(`Finding all portfolios for user with id ${userId}`);
    return this.db
      .select()
      .from(schema.portfolioTable)
      .where(eq(schema.portfolioTable.userId, userId));
  }

  findOne(id: number) {
    this.logger.log(`Finding portfolio with id ${id}`);
    return this.db
      .select()
      .from(schema.portfolioTable)
      .where(eq(schema.portfolioTable.id, id))
      .limit(1)
      .then((rows) => rows[0]);
  }

  update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    return `This action updates a #${id} portfolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} portfolio`;
  }
}
