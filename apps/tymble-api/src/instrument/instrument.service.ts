import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as schema from '@tymble/db';
import { eq, ilike, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { TymbleException } from '@/errors/tymble.exception';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

@Injectable()
export class InstrumentService {
  private readonly logger = new Logger(InstrumentService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto) {
    try {
      this.logger.log(
        `Creating a new instrument with symbol: "${createInstrumentDto.symbol}"`
      );

      const result = await this.db
        .insert(schema.instrumentTable)
        .values(createInstrumentDto)
        .returning();

      return result[0];
    } catch (error: unknown) {
      throw new TymbleException(
        this.logger,
        `Failed to create instrument with symbol: "${createInstrumentDto.symbol}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  async findAll() {
    this.logger.log('Finding all instruments');
    return await this.db.select().from(schema.instrumentTable);
  }

  async fuzzySearch(query: string) {
    this.logger.log(`Fuzzy searching instruments for query: ${query}`);

    const pattern = `%${query}%`;

    return await this.db
      .select()
      .from(schema.instrumentTable)
      .where(
        or(
          ilike(schema.instrumentTable.symbol, pattern),
          ilike(schema.instrumentTable.name, pattern)
        )
      )
      .limit(20);
  }

  async findOne(id: string) {
    this.logger.log(`Finding instrument with id ${id}`);
    const result = await this.db
      .select()
      .from(schema.instrumentTable)
      .where(eq(schema.instrumentTable.id, id));

    if (result.length === 0) {
      throw new TymbleException(
        this.logger,
        `Instrument with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result[0];
  }

  async findBySymbol(symbol: string) {
    this.logger.log(`Finding instrument with symbol ${symbol}`);
    const result = await this.db
      .select()
      .from(schema.instrumentTable)
      .where(eq(schema.instrumentTable.symbol, symbol));

    return result[0] || null;
  }

  async update(id: string, updateInstrumentDto: UpdateInstrumentDto) {
    this.logger.log(`Updating instrument with id ${id}`);

    try {
      const result = await this.db
        .update(schema.instrumentTable)
        .set({ ...updateInstrumentDto, updatedAt: new Date().toISOString() })
        .where(eq(schema.instrumentTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new TymbleException(
          this.logger,
          `Instrument with id "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }

      return result[0];
    } catch (error: unknown) {
      if (error instanceof TymbleException) {
        throw error;
      }
      throw new TymbleException(
        this.logger,
        `Failed to update instrument with id: "${id}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing instrument with id ${id}`);

    const result = await this.db
      .delete(schema.instrumentTable)
      .where(eq(schema.instrumentTable.id, id))
      .returning({ id: schema.instrumentTable.id });

    if (result.length === 0) {
      throw new TymbleException(
        this.logger,
        `Instrument with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result[0];
  }
}
