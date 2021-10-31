import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BinanceService } from './binance.service';

@Module({
	imports: [DatabaseModule],
	providers: [BinanceService],
	exports: [BinanceService]
})
export class BinanceModule { }
