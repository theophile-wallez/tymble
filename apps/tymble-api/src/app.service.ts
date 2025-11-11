import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@repo/db/index';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from './drizzle/drizzle.provider';

@Injectable()
export class AppService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async getFirstUser() {
    const existingUser = await this.db.query.usersTable.findFirst({});
    return existingUser;
  }
}
