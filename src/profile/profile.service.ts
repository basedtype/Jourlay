import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { BinanceService } from 'src/modules/binance/binance.service';

@Injectable()
export class ProfileService {

    constructor(private readonly binanceService: BinanceService) { }

    loadPage(path: string) {
        //this.binanceService.getBalance('ETH');
        if (path !== '/') return fs.readFileSync(`./www/profile${path}/index.html`, 'utf8');
        return fs.readFileSync('./www/profile/index.html', 'utf8');
    }
}
