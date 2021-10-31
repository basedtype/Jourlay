import { Module } from '@nestjs/common';
import { HtlbService } from './htlb.service';

@Module({
  providers: [HtlbService]
})
export class HtlbModule {}
