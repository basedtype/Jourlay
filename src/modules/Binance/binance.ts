/* IMPORTS */
import { client } from "./main";

/* CLASSES */
export class binance {
    public static async getPrices() {
        return await this._getPrices();
    }

    private static async _checkPrices() {
        const data = await this._getPrices();
        return data;
    }

    private static async _getPrices() {
        return client.prices(async (err, prices) => {
            if (err || prices == null || prices.BTCUSD == null || prices.ETHUSD == null || prices.BTCRUB == null || prices.ETHRUB == null) {
                if (err) console.log(err)
                await this._checkPrices();
            } else {
                console.log(prices)
                return {
                    BTCtoUSD: Math.round(prices.BTCUSD),
                    BTCtoRUB: Math.round(prices.ETHUSD),
                    ETHtoUSD: Math.round(prices.BTCRUB),
                    ETHtoRUB: Math.round(prices.ETHRUB),
                }
            }
        })
    }
}