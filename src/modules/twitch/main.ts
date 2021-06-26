/* IMPORTS */
import { twitch } from "../Bots/TwitchBot";

import * as Multiprogress from 'multi-progress';
import * as tmi from 'tmi.js';

/* PARAMS */
const multi = new Multiprogress(process.stderr);
const bar = multi.newBar(' getting twitch client [:bar] :percent :etas', {
    complete: '+',
    incomplete: '-',
    width: 30,
    total: 10
});
export let client: tmi.Client = null;
let getClient: boolean = false;

/* INTERVALS */
let clientIntervalID = setInterval(() => {
    if (client != null) clearInterval(clientIntervalID);
    if (getClient === false) twitch.connect('jourloy');
    client = twitch.update();
    getClient = true;
}, 1000)

let startIntervalID = setInterval(() => {
    bar.tick(1)
    if (client == null) return;
    if (client != null) {
        require('./twitch');
        clearInterval(startIntervalID);
    }
}, 1000)