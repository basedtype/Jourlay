import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
const { Spot } = require('@binance/connector')
import { Binance, Config } from 'types';
import * as _ from 'lodash';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import { file } from 'tmp-promise';

@Injectable()
export class BinanceService {
    constructor(private readonly databaseService: DatabaseService) { }

    private client: any = null;
    private path: string = null;
    priceCurrentPeriod: Binance.CurrentPeriod = { bid: { startPrice: '0', prices: [], avgDirection: 'none' }, ask: { startPrice: '0', prices: [], avgDirection: 'none' }, amount: 0, id: 0 }
    priceLastPeriods: Binance.CurrentPeriod[] = [];

    private async calculateAverage(prices: Binance.PeriodPrice[], startPrice: string): Promise<'none' | 'up' | 'down'> {
        const checkPrice = parseFloat(startPrice);
        const stat = {
            down: {
                count: 0,
                sum: 0.0
            },
            up: {
                count: 0,
                sum: 0.0
            },
            none: {
                count: 0,
                sum: 0.0
            },
            steps: 0,
        }

        for (let i in prices) {
            const priceData = prices[i];
            const price = parseFloat(priceData.lastPrice);
            if (checkPrice === price) stat.none.count++;
            else if (price > checkPrice) {
                stat.up.count++;
                stat.up.sum += price - checkPrice;
            } else if (price < checkPrice) {
                stat.down.count++;
                stat.down.sum = checkPrice - price;
            }
            stat.steps++;
        }

        const noneP = stat.none.count / stat.steps * 100;
        if (noneP > 50) return 'none';
        else if (stat.down.sum > stat.up.sum) return 'down';
        else return 'up'
    }

    @Cron('0 */10 * * * *')
    private async getClient() {
        if (this.client != null) return
        const config: Config.Service = await this.databaseService.getConfig('Binance', 'API')
        this.client = new Spot(config.auth.api, config.auth.secret)
    }

    @Cron('0 */30 * * * *')
    private async savePeriods() {
        if (this.path == null) {
            const {fd, path, cleanup} = await file();
            this.path = path;
        }
        const data = JSON.stringify(this.priceLastPeriods);
        fs.writeFileSync(this.path, data);
        console.log(this.path)
    }

    @Cron('0 */1 * * * *')
    private async clearTimePeriod() {
        this.priceLastPeriods.push(this.priceCurrentPeriod);
        this.priceCurrentPeriod = { bid: { startPrice: '0', prices: [], avgDirection: 'none' }, ask: { startPrice: '0', prices: [], avgDirection: 'none' }, amount: 0, id: 0 };
    }

    @Cron('*/10 * * * * *')
    private async buildPriceDirection() {
        const bookTicker = await this.getBookTicker('ETHRUB');
        const bidPrice = parseFloat(bookTicker.bidPrice).toFixed(1);
        const askPrice = parseFloat(bookTicker.askPrice).toFixed(1);

        if (this.priceCurrentPeriod.bid.startPrice === '0') this.priceCurrentPeriod.bid.startPrice = bidPrice;
        if (this.priceCurrentPeriod.ask.startPrice === '0') this.priceCurrentPeriod.ask.startPrice = askPrice;

        let bidDirection: 'down' | 'up' | 'none' = null;
        if (this.priceCurrentPeriod.bid.startPrice > bidPrice) bidDirection = 'down';
        else if (this.priceCurrentPeriod.bid.startPrice < bidPrice) bidDirection = 'up';
        else bidDirection = 'none';

        let askDirection: 'down' | 'up' | 'none' = null;
        if (this.priceCurrentPeriod.ask.startPrice > bidPrice) askDirection = 'down';
        else if (this.priceCurrentPeriod.ask.startPrice < bidPrice) askDirection = 'up';
        else bidDirection = 'none';

        const periodPriceBid: Binance.PeriodPrice = {lastPrice: bidPrice, direction: bidDirection};
        const periodPriceAsk: Binance.PeriodPrice = {lastPrice: askPrice, direction: askDirection};

        this.priceCurrentPeriod.bid.prices.push(periodPriceBid);
        this.priceCurrentPeriod.ask.prices.push(periodPriceAsk);

        const avgDirectionBid = await this.calculateAverage(this.priceCurrentPeriod.bid.prices, this.priceCurrentPeriod.bid.startPrice);
        const avgDirectionAsk = await this.calculateAverage(this.priceCurrentPeriod.ask.prices, this.priceCurrentPeriod.ask.startPrice);

        this.priceCurrentPeriod.bid.avgDirection = avgDirectionBid;
        this.priceCurrentPeriod.ask.avgDirection = avgDirectionAsk;

        this.priceCurrentPeriod.amount++;
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
