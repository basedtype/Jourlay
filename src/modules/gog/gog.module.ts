import { Module } from '@nestjs/common';
import { GogService } from './gog.service';

@Module({
  providers: [GogService]
})
export class GogModule {}
