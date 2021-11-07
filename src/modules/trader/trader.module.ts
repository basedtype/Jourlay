import { Module } from '@nestjs/common';
import { BinanceModule } from '../binance/binance.module';
import { TraderService } from './trader.service';

@Module({
	imports: [BinanceModule],
	providers: [TraderService],
	exports: [TraderService],
})
export class TraderModule { }
