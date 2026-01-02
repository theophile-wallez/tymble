import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as schema from '@tymble/db';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '@/drizzle/drizzle.provider';
import { TymbleException } from '@/errors/tymble.exception';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    try {
      const instrumentId =
        'instrumentId' in createAssetDto
          ? createAssetDto.instrumentId
          : undefined;
      const instrumentDto =
        'instrument' in createAssetDto ? createAssetDto.instrument : undefined;

      this.logger.log(
        `Creating asset for portfolioId: "${createAssetDto.portfolioId}"`
      );

      let resolvedInstrumentId = instrumentId ?? null;

      if (!resolvedInstrumentId && instrumentDto) {
        const existingInstrument = await this.db.query.instrumentTable.findFirst(
          {
            where: eq(schema.instrumentTable.symbol, instrumentDto.symbol),
          }
        );

        if (existingInstrument) {
          resolvedInstrumentId = existingInstrument.id;
        } else {
          const insertedInstrument = await this.db
            .insert(schema.instrumentTable)
            .values(instrumentDto)
            .returning();

          resolvedInstrumentId = insertedInstrument[0]?.id ?? null;
        }
      }

      if (!resolvedInstrumentId) {
        throw new TymbleException(
          this.logger,
          'Missing instrument identifier or instrument payload',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.db
        .insert(schema.assetsTable)
        .values({
          portfolioId: createAssetDto.portfolioId,
          instrumentId: resolvedInstrumentId,
          quantity: createAssetDto.quantity ?? '0',
          averagePrice: createAssetDto.averagePrice ?? '0',
          fee: createAssetDto.fee ?? '0',
        })
        .returning();

      return result[0];
    } catch (error: unknown) {
      if (error instanceof TymbleException) {
        throw error;
      }
      throw new TymbleException(
        this.logger,
        `Failed to create asset for portfolioId: "${createAssetDto.portfolioId}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  findAll() {
    this.logger.log('Finding all assets');
    return this.db.query.assetsTable.findMany({
      with: {
        instrument: true,
        portfolio: true,
      },
    });
  }

  async findOne(id: string) {
    this.logger.log(`Finding asset with id ${id}`);
    const result = await this.db.query.assetsTable.findFirst({
      where: eq(schema.assetsTable.id, id),
      with: {
        instrument: true,
        portfolio: true,
        transactions: true,
      },
    });

    if (!result) {
      throw new TymbleException(
        this.logger,
        `Asset with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    this.logger.log(`Updating asset with id ${id}`);

    try {
      const result = await this.db
        .update(schema.assetsTable)
        .set({ ...updateAssetDto, updatedAt: new Date().toISOString() })
        .where(eq(schema.assetsTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new TymbleException(
          this.logger,
          `Asset with id "${id}" not found`,
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
        `Failed to update asset with id: "${id}"`,
        HttpStatus.BAD_REQUEST,
        error
      );
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing asset with id ${id}`);

    const result = await this.db
      .delete(schema.assetsTable)
      .where(eq(schema.assetsTable.id, id))
      .returning({ id: schema.assetsTable.id });

    if (result.length === 0) {
      throw new TymbleException(
        this.logger,
        `Asset with id "${id}" not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return result[0];
  }
}
