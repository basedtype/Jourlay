import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BinanceModule } from 'src/modules/binance/binance.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [DatabaseModule, BinanceModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
