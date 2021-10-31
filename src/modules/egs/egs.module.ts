import { Module } from '@nestjs/common';
import { EgsService } from './egs.service';

@Module({
  providers: [EgsService],
  exports: [EgsService]
})
export class EgsModule {}
