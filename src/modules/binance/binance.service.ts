import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
const { Spot } = require('@binance/connector')
import { Binance, Config } from 'types';
import * as _ from 'lodash';
import { Cron } from '@nestjs/schedule';
import { Service } from 'src/entity/services.entity';

@Injectable()
export class BinanceService {
    constructor(
        private readonly databaseService: DatabaseService,
        ) { }
    
    private readonly logger = new Logger(BinanceService.name);

    private client: any = null;

    @Cron('0 */10 * * * *')
    async getClient() {
        if (this.client != null) return
        const config: Service = await this.databaseService.serviceFindOne('Binance', 'Nidhoggbot')
        if (config == null) {
            this.logger.error(`Database can't find sevice with 'Binance' name and 'Nidhoggbot' target`);
            return;
        }
        this.client = new Spot(config.api, config.secret)
        this.logger.log(`Binance are ready`);
    }

    async getBalance(token: string) {
        if (this.client == null) await this.getClient();
        const account = await this.client.coinInfo().then(response => response.data);
        const result = _.filter(account, (o) => { return o.coin === token });
        if (result == null || result == []) return null;
        return result[0];
    }

    async getAccount() {
        if (this.client == null) await this.getClient();
        const account = await this.client.account().then(response => response.data);
        console.log(account)
    }

    async getDepth() {
        if (this.client == null) await this.getClient();
        const token = 'ETHRUB'
        const price = await this.client.depth(token).then(response => response.data);
        console.log(price);
    }

    async getBookTicker(token: string): Promise<Binance.BookTicker> {
        if (this.client == null) await this.getClient();
        const price: Binance.BookTicker = await this.client.bookTicker(token).then(response => response.data);
        return price;
    }
}
