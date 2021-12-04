import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';

@Module({
	imports: [DatabaseModule],
	providers: [BinanceService],
	exports: [BinanceService],
	controllers: [BinanceController]
})
export class BinanceModule { }
