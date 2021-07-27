/* IMPORTS */
import { discord } from "../discord/discord";
import { twitchFetch } from "./twitchFetch";
import { manager } from "../database/main";
import { callOfDuty } from "../COD/main";
import { tools } from "../tools/main";
import { client } from "./main";
import * as upt from "./uptime";
import "../COD/main"
import "./uptime";

import { _jourloy } from "../discord/main";
import * as _ from "lodash";

/* PARAM */

/* FUNCTIONS */

/* INTERVALS */

/* REACTIONS */
client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    if (channel !== '#jourloy') return;
    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    /* GENERAL */

    if (command === 'test') {
        twitchFetch.getCurrentViewers().then(data => console.log(data));
    } else if (command === 'watchtime') {
        twitchFetch.getUserID(username).then(id => {
            manager.getChatterInfo(id).then(chatter => {
                const seconds = chatter.watchTime;
                const time = tools.toHHMMSS(seconds);
                client.say(channel, `@${username}, your watchtime is ${time}`);
            })
        })
    } else if (command === '8ball') {
        const array = ['Да!','Нет!','Не знаю','Чутье подсказывает, что стоит','Чутье подсказывает, что не стоит','Хахаха, я лучше промолчу',];
        client.say(channel, `${_.sample(array)}`);
    } else if (command === 'roulette') {
        if (tools.random(1, 10) === 1) {
            client.timeout(channel, username, 10, 'БАБАХ');
            client.say(channel, 'БАБАХ! Вот и все');
        } else { client.say(channel, 'Хм, не заряжен, кажется тебе повезло') }
    }

    /* WARZONE */

    if (command === 'wz_level') {
        callOfDuty.getPlayerInfo().then(player => {
            const percent = Math.round(player.levelXpGained * 100 / (player.levelXpGained + player.levelXpRemainder));
            client.say(channel, `@${username}, now I have a ${player.level} level (Level progress: ${percent}%)`)
        })
    } else if (command === 'wz_kd') {

    }
})