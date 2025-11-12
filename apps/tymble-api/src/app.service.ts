import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@repo/db';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from './drizzle/drizzle.provider';

@Injectable()
export class AppService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async getFirstUsers() {
    const existingUsers = await this.db.query.usersTable.findMany({
      limit: 100,
    });
    return existingUsers;
  }
}
