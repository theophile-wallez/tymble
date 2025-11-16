import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@repo/db';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
@Injectable()
export class PortfolioService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}
  create(createPortfolioDto: CreatePortfolioDto) {
    this.db.insert(schema.portfolioTable).values(createPortfolioDto).returning({
      id: schema.portfolioTable.id,
    });
  }

  findAll() {
    return 'This action returns all portfolio';
  }

  findOne(id: number) {
    return `This action returns a #${id} portfolio`;
  }

  update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    return `This action updates a #${id} portfolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} portfolio`;
  }
}
