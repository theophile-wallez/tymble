import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [DrizzleModule],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
