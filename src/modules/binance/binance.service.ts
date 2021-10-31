import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
const { Spot } = require('@binance/connector')
import { Config } from 'types';
import * as _ from 'lodash';
@Injectable()
export class BinanceService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getBalance(token: string) {
        const config: Config.Service = await this.databaseService.getConfig('Binance', 'API')
        const client = new Spot(config.auth.api, config.auth.secret)
        const account = await client.coinInfo().then(response => response.data);
        const result = _.filter(account, (o) => { return o.coin === token});
        if (result == null || result == []) return null;
        return result[0];
    }
}
