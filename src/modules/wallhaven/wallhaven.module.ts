import { Module } from '@nestjs/common';
import { WallhavenService } from './wallhaven.service';

@Module({
  imports: [],
  providers: [WallhavenService],
  exports: [WallhavenService],
})
export class WallhavenModule {}
