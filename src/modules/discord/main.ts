/* IMPORTS */
import * as Multiprogress from 'multi-progress';
import { discord } from "../Bots/DiscordBot";

import * as ds from 'discord.js';

/* PARAMS */
const multi = new Multiprogress(process.stderr);
const bar = multi.newBar('Launch discord client [:bar] :percent :etas', {
    complete: '+',
    incomplete: '-',
    width: 30,
    total: 5
});
export let client: ds.Client = null;
export let _guild: ds.Guild = null;

/* INTERVALS */
const ticksIntervals = setInterval(() => {
    bar.tick(1);
}, 1000)

/* CODE */
setTimeout(() => {
    discord.init().then(() => {
        client = discord.client;
        _guild = discord._guild;
        clearInterval(ticksIntervals);
        bar.update(1);
        require('./discord');
    })
}, 1000)