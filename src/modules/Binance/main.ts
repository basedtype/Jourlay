/* IMPORTS */
import { manager } from "../database/main";

const Binance = require('node-binance-api');
export let client = null;

/* INTERVALS */
const connectInterval = setInterval(async () => {

    const bot: any = await manager.configGetBot('Nidhoggbot', 'Binance');

    const bin = new Binance().options({
        APIKEY: bot.api_key,
        APISECRET: bot.oauth
    })
    client = bin;
    require('./binance');
    clearInterval(connectInterval);
}, 1000)