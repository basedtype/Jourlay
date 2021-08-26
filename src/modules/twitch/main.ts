/* IMPORTS */
import { twitch } from "../Bots/TwitchBot";
import { twitchAdmin } from "../Bots/MainTwitchChannel";

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
export let admin: tmi.Client = null;
let getClient = false;
let getAdmin = false
let counter = 0;

/* INTERVALS */
let clientIntervalID = setInterval(() => {
    if (client != null) clearInterval(clientIntervalID);
    if (getClient === false) twitch.connect('jourloy');
    client = twitch.update();
    getClient = true;
}, 1000)

let adminIntervalID = setInterval(() => {
    if (admin != null) clearInterval(clientIntervalID);
    if (getAdmin === false) twitchAdmin.connect('jourloy');
    admin = twitchAdmin.update();
    getAdmin = true;
}, 1000)

let startIntervalID = setInterval(() => {
    bar.tick(1)
    counter++;
    if (counter < 5) return;
    if (client == null) return;
    if (client != null) {
        require('./twitch');
        clearInterval(startIntervalID);
        clearInterval(adminIntervalID);
    }
}, 1000)