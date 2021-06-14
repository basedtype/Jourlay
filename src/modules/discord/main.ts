/* IMPORTS */
import * as Multiprogress from 'multi-progress';
import { discord } from "../Bots/DiscordBot";
import { config } from "../../../types";

import * as ds from 'discord.js';

/* PARAMS */
const multi = new Multiprogress(process.stderr);
const bar = multi.newBar(' getting discord client [:bar] :percent :etas', {
    complete: '+',
    incomplete: '-',
    width: 30,
    total: 5
});
export let client: ds.Client = null;
export let _jourloy: config.discordOptions = null;
let counter = 0
let getClient: boolean = false;

/* INTERVALS */
let clientIntervalID = setInterval(() => {
    if (client != null) clearInterval(clientIntervalID);
    if (getClient === false) discord.connect('437601028662231040');
    client = discord.client;
    _jourloy = discord._jourloy;
    getClient = true;
}, 1000)

let startIntervalID = setInterval(() => {
    bar.tick(1)
    counter++;
    if (counter < 5) return;
    if (client != null && _jourloy.guild != null) {
        require('./discord');
        clearInterval(startIntervalID);
    }
}, 1000)