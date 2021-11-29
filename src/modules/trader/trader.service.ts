import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BinanceLog } from 'src/entity/binance.entity';
import { Binance } from 'types';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TraderService {
	constructor(private readonly binanceSevice: BinanceService) {}

	private readonly logger = new Logger(TraderService.name);

	private test = {
		on: true,
		wallet: {
			ETH: 0.00065421,
			rub: 0,
		},
		maxEth: 0.005,
		maxRub: 500,
		minEth: 0.0001,
	};

	private state = 0; /* 0 - sell, 1 - buy */
	private price = 0;
	private amount = 0; /* ? */
	private tries = 0;
	private staticPrice = 100;

	private priceCurrentPeriod: Binance.CurrentPeriod = {
		bid: { startPrice: '0', prices: [], avgDirection: 'none' },
		ask: { startPrice: '0', prices: [], avgDirection: 'none' },
		amount: 0,
		id: 0,
	};
	priceLastPeriods: Binance.CurrentPeriod[] = [];

	private async calculateAverage(
		prices: Binance.PeriodPrice[],
		startPrice: string
	): Promise<'none' | 'up' | 'down'> {
		const checkPrice = parseFloat(startPrice);
		const stat = {
			down: {
				count: 0,
				sum: 0.0,
			},
			up: {
				count: 0,
				sum: 0.0,
			},
			none: {
				count: 0,
				sum: 0.0,
			},
			steps: 0,
		};

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

		const noneP = (stat.none.count / stat.steps) * 100;
		if (noneP > 50) return 'none';
		else if (stat.down.sum > stat.up.sum) return 'down';
		else return 'up';
	}

	@Cron('0 */1 * * * *')
	private async clearTimePeriod() {
		this.priceCurrentPeriod = {
			bid: { startPrice: '0', prices: [], avgDirection: 'none' },
			ask: { startPrice: '0', prices: [], avgDirection: 'none' },
			amount: 0,
			id: 0,
		};
	}

	@Cron('*/1 * * * * *')
	private async buildPriceDirection() {
		const bookTicker = await this.binanceSevice.getBookTicker('ETHRUB');
		const bidPrice = parseFloat(bookTicker.bidPrice).toFixed(1);
		const askPrice = parseFloat(bookTicker.askPrice).toFixed(1);

		if (this.priceCurrentPeriod.bid.startPrice === '0')
			this.priceCurrentPeriod.bid.startPrice = bidPrice;
		if (this.priceCurrentPeriod.ask.startPrice === '0')
			this.priceCurrentPeriod.ask.startPrice = askPrice;

		let bidDirection: 'down' | 'up' | 'none' = null;
		if (this.priceCurrentPeriod.bid.startPrice > bidPrice) bidDirection = 'down';
		else if (this.priceCurrentPeriod.bid.startPrice < bidPrice) bidDirection = 'up';
		else bidDirection = 'none';

		let askDirection: 'down' | 'up' | 'none' = null;
		if (this.priceCurrentPeriod.ask.startPrice > bidPrice) askDirection = 'down';
		else if (this.priceCurrentPeriod.ask.startPrice < bidPrice) askDirection = 'up';
		else bidDirection = 'none';

		const periodPriceBid: Binance.PeriodPrice = {
			lastPrice: bidPrice,
			direction: bidDirection,
		};
		const periodPriceAsk: Binance.PeriodPrice = {
			lastPrice: askPrice,
			direction: askDirection,
		};

		this.priceCurrentPeriod.bid.prices.push(periodPriceBid);
		this.priceCurrentPeriod.ask.prices.push(periodPriceAsk);

		const avgDirectionBid = await this.calculateAverage(
			this.priceCurrentPeriod.bid.prices,
			this.priceCurrentPeriod.bid.startPrice
		);
		const avgDirectionAsk = await this.calculateAverage(
			this.priceCurrentPeriod.ask.prices,
			this.priceCurrentPeriod.ask.startPrice
		);

		this.priceCurrentPeriod.bid.avgDirection = avgDirectionBid;
		this.priceCurrentPeriod.ask.avgDirection = avgDirectionAsk;

		this.priceCurrentPeriod.amount++;

		const log = new BinanceLog();
		log.askPrice = askPrice;
		log.bidPrice = bidPrice;
		log.currency = 'ETHRUB';

		await this.trade();

		//this.databaseService.binanceLogInsertOne(log);
		//this.logger.debug('Binance save market info')
	}

	private calculatePercent(from: number, percent: number) {
		return parseFloat(((from / 100) * percent).toFixed(2));
	}

	private async trade() {
		if (this.state === 0) {
			if (this.test.on) {
				const bookTicker = await this.binanceSevice.getBookTicker('ETHRUB');
				const bidPrice = parseFloat(parseFloat(bookTicker.bidPrice).toFixed(1));

				const sellAmount =
					this.test.wallet.ETH > this.test.maxEth
						? this.test.maxEth
						: this.test.wallet.ETH;

				const amount =
					bidPrice * sellAmount - this.calculatePercent(bidPrice * sellAmount, 0.5);

				if (bidPrice < this.price + this.calculatePercent(bidPrice * sellAmount, 0.5) + this.staticPrice )
					return;

				this.test.wallet.ETH -= sellAmount;
				this.test.wallet.rub += amount;

				this.state = 1;
				this.price = bidPrice;

				this.logger.log(
					`Sell | ETH: ${this.test.wallet.ETH} | RUB: ${this.test.wallet.rub}`
				);
			}
		} else if (this.state === 1) {
			if (this.test.on) {
				const bookTicker = await this.binanceSevice.getBookTicker('ETHRUB');
				const askPrice = parseFloat(parseFloat(bookTicker.bidPrice).toFixed(1));

				const buyAmount =
					this.test.wallet.rub > this.test.maxRub
						? this.test.maxRub
						: this.test.wallet.rub;

				const amount =
					buyAmount / askPrice - this.calculatePercent(buyAmount / askPrice, 0.5);

				if (
					askPrice > this.price + this.calculatePercent(buyAmount / askPrice, 0.5) + this.staticPrice &&
					this.tries < 3600
				) {
					this.tries++;
					return;
				}

				this.test.wallet.rub -= buyAmount;
				this.test.wallet.ETH += amount;

				this.state = 0;
				this.price = askPrice;

				this.logger.log(
					`Buy | ETH: ${this.test.wallet.ETH} | RUB: ${this.test.wallet.rub} | Try: ${this.tries}`
				);

				this.tries = 0;
			}
		}
	}
}
