/* IMPORTS */
import { discord } from "../discord/discord";
import { twitchFetch } from "./twitchFetch";
import { manager } from "../database/main";
import { defence } from "../defence/main";
import { client, admin } from "./main";
import { tools } from "../tools/main";
import * as upt from "./uptime";
import "../COD/main"
import "./uptime";

import { _jourloy } from "../discord/main";
import * as _ from "lodash";

/* PARAM */
let streamNoftification = false;
let uptime: number[] = null;
let game = null;

/* INTERVALS */
/**
 * Update uptime
 * Noftification
 */
setInterval(() => {
    game = upt.game;
    uptime = upt.uptime;
    if (uptime != null) {
        const hours = uptime[0];
        const minutes = uptime[1];
        if (hours === 0 && minutes > 1 && streamNoftification === false) {
            discord.sendNoftification();
            streamNoftification = true;
            setTimeout(() => { streamNoftification = false }, tools.convertTime({ hours: 5 }));
        }
    }
}, 1000)

/**
 * Start commercial
 */
setInterval(() => {
    if (uptime == null) return;
    admin.commercial('#jourloy', 180)
        .then(() => discord.sendCommercialLog())
        .catch((err) => console.log(`Commercial ERROR:\n${err}`));
}, tools.convertTime({ minutes: 18 }))

/* FUNCTIONS */
function say(text: string) {
    client.say('#jourloy', text);
}

/* REACTIONS */
client.on('redeem', (channel, username, rewardType, tags) => {
    if (rewardType === '24b9fba4-05dd-4324-b364-57f8a38b5d4e') {
        client.timeout(channel, username, 120, 'Награда')
            .then(() => { })
            .catch(err => { console.log(err) })
    }
})

client.on('message', async (channel, userstate, message, self) => {
    if (self) return;
    if (channel !== '#jourloy') return;

    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1].toLowerCase();
    const id = await twitchFetch.getUserID(username);

    /* DEFENCE CHAT */
    const defenceCheck = await defence.check(message.toLowerCase(), id);
    if (defenceCheck.bool === false) {
        client.timeout(channel, username, 100, 'Defence');
        const avataria = ['аватария', 'анкор', 'ава', 'полина румянцева', 'pr_'];
        if (avataria.includes(defenceCheck.reason) === true) client.say(channel, `У нас есть прекрасный дискорд сервер (команда !ds), где можно общаться о чем угодно, но на этом канале на эту тему общаться не стоит`);
        return;
    }

    const defenceBotCheck = await defence.checkBots(message.toLowerCase());
    if (defenceBotCheck.bool === false) {
        client.timeout(channel, username, 100, 'Defence');
        client.followersonly(channel, 10);
        return;
    }

    /* SIMPLE COMMANDS */

    if (command === 'shorts') say('Все ютуб shorts лежат вот тут --> jourloy.ru/youtube-shorts');
    else if (command === 'ds' || command === 'discord' || command === 'дс' || command === 'дискорд') say('Залетай в наше дискорд сообщество --> jourloy.ru/discord');
    else if (command === 'yt' || command === 'youtube') say('Я выкладываю свои ролики сюда --> jourloy.ru/youtube');
    else if (command === 'ping' && username === 'jourloy') say('pong');
    else if (command === 'dbguys') say('DBguys расшифровывается как "Deaf Blind Guys". Киберспортивная команда, которая показывает невероятные успехи. Командиром команды является Jourloy. Состоит команда из командира и одно игрока под ником Jourloy');

    /* HARD COMMANDS */

    if (command === 'followerage') {
        twitchFetch.getUserID(username).then(userID => {
            twitchFetch.getUserID('jourloy').then(myID => {
                twitchFetch.get(`https://api.twitch.tv/helix/users/follows?from_id=${userID}&to_id=${myID}`).then(data => {
                    const followed_at: Date = data.data[0].followed_at;
                    const then = new Date(followed_at).getTime();
                    const now = new Date().getTime();
                    const time = Math.floor((now - then) / 1000);
                    const formatted = tools.toDDHHMMSS(time);
                    say(`Ты мой бравый фолловер уже ${formatted}`);
                });
            })
        })
    } else if (command === 'watchtime') {
        twitchFetch.getUserID(username).then(id => {
            manager.getChatterInfo(id).then(chatter => {
                if (chatter == null || chatter.watchTime == null) return;
                const seconds = chatter.watchTime;
                const time = tools.toHHMMSS(seconds);
                client.say(channel, `@${username}, ты смотришь этот канал: ${time}`);
            })
        })
    } else if (command === 'uptime') {
        if (game === 'Call of Duty: Warzone') say(`Убиваем противников уже ${uptime[0]}:${uptime[1]}:${uptime[2]}`);
        else if (game === "Minecraft") say(`Расставляем кубики по местам на протяжении ${uptime[0]}:${uptime[1]}:${uptime[2]}`);
        else say(`Стрим идет уже ${uptime[0]}:${uptime[1]}:${uptime[2]}`);
    }

    /* MINI-GAMES */

    if (command === '8ball') {
        if (message.includes('?') === false || message.length < 13) return;
        if (message.includes('стоит') === false) {
            const array = ['Да!', 'Нет!', 'Не знаю', 'Хахаха, я лучше промолчу',];
            client.say(channel, `${_.sample(array)}`);
        } else {
            const array = ['Да!', 'Нет!', 'Не знаю', 'Чутье подсказывает, что стоит', 'Чутье подсказывает, что не стоит', 'Хахаха, я лучше промолчу',];
            client.say(channel, `${_.sample(array)}`);
        }
    } else if (command === 'duel') {

    } else if (command === 'lottery') {

    } else if (command === 'roulette') {
        const shot = (tools.random(1, 8) === 1) ? true : false;
        const preShotSay = ['я кручу барабан, взвожу курок, нажимаю и...', 'барабан крутится и я резко его останавливаю и жму на курок...'];
        say(`@${username}, ` + _.sample(preShotSay));
        setTimeout(() => {
            if (shot === true) {
                say(`@${username}, ВЫСТРЕЛ! Как всегда - метко`);
                client.timeout(channel, username, 30, 'MINI-GAME').catch(() => { });
            } else say(`@${username}, Щелчок, но выстрел не произошел. Повезло, пока что...`);
        }, tools.convertTime({ seconds: 5 }))
    } else if (command === 'roll') {
        if (parseInt(messageSplit[1]) < 2) client.say(channel, `Выпало: 2Head`);
        else client.say(channel, `Выпало: ${tools.random(1, parseInt(messageSplit[1]))}`);
    }
})