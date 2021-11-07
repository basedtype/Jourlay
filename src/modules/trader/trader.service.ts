import { Injectable } from '@nestjs/common';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TraderService {

    constructor (
        private readonly binanceSevice: BinanceService,
    ) {}
};