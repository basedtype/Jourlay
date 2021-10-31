import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';

@Module({
  providers: [SteamService]
})
export class SteamModule {}
