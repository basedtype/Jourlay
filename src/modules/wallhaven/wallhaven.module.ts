import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WallhavenService } from './wallhaven.service';

@Module({
  imports: [DatabaseModule],
  providers: [WallhavenService],
  exports: [WallhavenService],
})
export class WallhavenModule {}
