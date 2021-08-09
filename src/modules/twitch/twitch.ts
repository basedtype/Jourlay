/* IMPORTS */
import { discord } from "../discord/discord";
import { twitchFetch } from "./twitchFetch";
import { manager } from "../database/main";
import { defence } from "../defence/main";
import { tools } from "../tools/main";
import { client } from "./main";
import * as upt from "./uptime";
import "../COD/main"
import "./uptime";

import { _jourloy } from "../discord/main";
import * as _ from "lodash";

/* PARAM */
let streamNoftification = false;
let uptime: number[] = null;

/* INTERVALS */
/**
 * Update uptime
 * Noftification
 */
setInterval(() => {
    uptime = upt.uptime;

    if (uptime != null) {
        const hours = uptime[0];
        const minutes = uptime[1];
        const seconds = uptime[2];

        if (hours === 0 && minutes > 1 && streamNoftification === false) {
            discord.sendNoftification();
            streamNoftification = true;
            setTimeout(() => {streamNoftification = false}, tools.convertTime({hours: 5}));
        }
    }
}, 1000)

/* FUNCTIONS */

/* REACTIONS */
client.on('message', async (channel, userstate, message, self) => {
    if (self) return;
    if (channel !== '#jourloy') return;

    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];
    const id = await twitchFetch.getUserID(username);
    const defenceCheck = await defence.check(message.toLowerCase(), id);

    /* DEFENCE CHAT */

    if (defenceCheck.bool === false) {
        client.timeout(channel, username, 100, 'Defence');
        console.log(`Defence: true`);
        const avataria = ['аватария', 'анкор', 'ава', 'полина румянцева', 'pr_'];
        if (avataria.includes(defenceCheck.reason) === true) client.say(channel, `У нас есть прекрасный дискорд сервер, где можно общаться о чем угодно, но на этом канале на эту тему общаться не стоит`);
        return;
    }

    /* GENERAL */

    if (command === 'test') {
        twitchFetch.getCurrentViewers().then(data => console.log(data));
    } else if (command === 'watchtime') {
        twitchFetch.getUserID(username).then(id => {
            manager.getChatterInfo(id).then(chatter => {
                if (chatter == null || chatter.watchTime == null) return;
                const seconds = chatter.watchTime;
                const time = tools.toHHMMSS(seconds);
                client.say(channel, `@${username}, ты смотришь этот канал: ${time}`);
            })
        })
    } else if (command === '8ball') {
        if (message.includes('?') === false || message.length < 13) return;
        const array = ['Да!','Нет!','Не знаю','Чутье подсказывает, что стоит','Чутье подсказывает, что не стоит','Хахаха, я лучше промолчу',];
        client.say(channel, `${_.sample(array)}`);
    } else if (command === 'roulette') {
        if (tools.random(1, 10) === 1) {
            client.timeout(channel, username, 10, 'БАБАХ');
            client.say(channel, 'БАБАХ! Вот и все');
        } else { client.say(channel, 'Хм, не заряжен, кажется тебе повезло') }
    } else if (command === 'dbguys') {
        client.say(channel, `DBguys расшифровывается как "Deaf Blind Guys". Киберспортивная команда, которая показывает невероятные успехи. Командиром команды является Jourloy. Состоит команда из командира и одно игрока под ником Jourloy`)
    } else if (command === 'roll' && isNaN(parseInt(messageSplit[1])) !== true) {
        client.say(channel, `Выпало: ${tools.random(1, parseInt(messageSplit[1]))}`);
    } else if (command === 'followerage') {
        //
    }
})