import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  create(createTransactionDto: CreateTransactionDto) {
    this.logger.log('Creating a new transaction');
    return 'This action adds a new transaction';
  }

  findOne(id: number) {
    this.logger.log(`Finding transaction with id ${id}`);
    return `This action returns a #${id} transaction`;
  }

  findAllByAssetId(assetId: number) {
    this.logger.log(`Finding all transactions for asset with id ${assetId}`);
    return `This action returns all transactions for asset #${assetId}`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(`Updating transaction with id ${id}`);
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    this.logger.log(`Removing transaction with id ${id}`);
    return `This action removes a #${id} transaction`;
  }
}
