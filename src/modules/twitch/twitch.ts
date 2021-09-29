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

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import * as moment from "moment";
import * as _ from "lodash";

/* PARAMS */
const hltbService = new HowLongToBeatService();
const rewardsID = {
    chatting: [],
    warzone: [],
}
const rewardsBool = {
    test: false,
    chatting: false,
}
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
/* setInterval(() => {
    if (uptime == null) return;
    admin.commercial('#jourloy', 180)
        .then(() => discord.sendCommercialLog())
        .catch((err) => console.log(`Commercial ERROR:\n${err}`));
}, tools.convertTime({ minutes: 18 })) */

/* setInterval(() => {
    // https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=274637212&id=92af127c-7326-4483-a52b-b0da0be61c01&is_enabled=true
    if (rewardsBool.test === false) {
        //twitchFetch.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=158466757`, `{title: 'test title', cost: 1000}`).then(data => console.log(data))
        twitchFetch.get('https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=158466757&only_manageable_rewards=true', null, true).then(data => console.log(data))
        rewardsBool.test = true;
    }
    if (uptime == null) {

    } else if (uptime != null) {
        if (game === 'Call of Duty: Warzone') return;
    }
}, 1000) */

/* FUNCTIONS */
function say(text: string) {
    client.say('#jourloy', text);
}

/* REACTIONS */
client.on('redeem', (channel, username, rewardType, tags) => {
    console.log(rewardType);
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
    const command = msSplit[1];
    const id = await twitchFetch.getUserID(username);

    /* DEFENCE CHAT */
    const defenceCheck = await defence.check(message.toLowerCase(), id);
    if (defenceCheck.bool === false) {
        client.timeout(channel, username, 100, 'Defence');
        return;
    }

    /* const defenceBotCheck = await defence.checkBots(message.toLowerCase());
    if (defenceBotCheck.bool === false) {
        client.timeout(channel, username, 100, 'Defence');
        client.followersonly(channel, 10);
        return;
    } */

    /* SIMPLE COMMANDS */

    if (command === 'shorts') say('Все ютуб shorts лежат вот тут --> jourloy.ru/youtube-shorts');
    else if (command === 'ds' || command === 'discord' || command === 'дс' || command === 'дискорд') say('Залетай в наше дискорд сообщество --> jourloy.ru/discord');
    else if (command === 'yt' || command === 'youtube') say('Я выкладываю свои ролики сюда --> jourloy.ru/youtube');
    else if (command === 'ping' && username === 'jourloy') say('pong');
    else if (command === 'dbguys') say('DBguys расшифровывается как "Deaf Blind Guys". Киберспортивная команда, которая показывает невероятные успехи. Командиром команды является Jourloy. Состоит команда из командира и одно игрока под ником Jourloy');
    else if (command === 'donate' || command === 'донат') say('Отправить деньги можно тут --> jourloy.ru/donate');
    else if (command === 'tiktok' || command === 'тикток') say('Зачекать тиктоки можно тут --> jourloy.ru/tiktok');

    /* HARD COMMANDS */

    if (command === 'watchtime') {
        twitchFetch.getUserID(username).then(id => {
            manager.getChatterInfo(id).then(chatter => {
                if (chatter == null || chatter.watchTime == null) return;
                const seconds = chatter.watchTime;
                const time = tools.toHHMMSS(seconds);
                client.say(channel, `@${username}, ты смотришь этот канал: ${time}`);
            })
        })
    } else if (command === 'uptime') {
        if (uptime == null) say(`А стрима то нет`);
        else if (game === 'Call of Duty: Warzone') say(`Летаем над Верданском уже ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
        else if (game === "Minecraft") say(`Расставляем кубики по местам на протяжении ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
        else if (game === "Phasmophobia") say(`Записываем призраков на камеру уже ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
        else if (game === "Baldur's Gate 3") say(`Кидаем кубики и промахиваемся на протяжении ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
        else if (game === "Divinity: Original Sin II") say(`Разносим всех и вся пошагово уже ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
        else say(`Стрим идет ${uptime[0]}ч ${uptime[1]}м ${uptime[2]}с`);
    } else if (command === 'raid' && username === 'jourloy') {
        const friends = ['basedtype', 'mezafaka', 'h0wl1ng', 'miaytt', 'sonya_mercury'];
        const IDs = [];
        const online = [];
        for (let i in friends) await (IDs.push(await twitchFetch.getUserID(friends[i])));
        for (let i in IDs) {
            const opt = {
                method: "GET",
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    "Client-ID": "qetz5m3hw8vv6qsid3uobvl8kjotfk",
                    'Authorization': ''
                }
            }
            const oauthToken = await manager.configGetBot('Nidhoggbot', 'Twitch');
            opt.headers.Authorization = 'OAuth ' + oauthToken._oauth;
            await twitchFetch.get(`https://api.twitch.tv/kraken/streams/${IDs[i]}`, opt)
                .then(data => {
                    if (data != null && data.stream != null) {
                        const now = new Date();
                        const then = data.stream.created_at;
                        const ms = moment(now).diff(moment(then));
                        const d = moment.duration(ms);
                        const uptimeFriend = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                        const gameFriend = data.stream.game;
                        const name = data.stream.channel.display_name;
                        online.push({ username: name, game: gameFriend, uptime: uptimeFriend });
                    } else { };
                })
                .catch(() => { });
        }
        if (online.length > 0) {
            const targetRaid = _.sample(online);
            say(`Там "${targetRaid.username} стримит уже ${targetRaid.uptime}. Он сейчас играет в ${targetRaid.game}`);
        } else say(`Из друзей сейчас никто не стримит`);
    } else if ((message.indexOf('пошли') !== -1 || message.indexOf('го') !== -1 || message.indexOf('давай') !== -1) && (message.indexOf('варзон') !== -1 || message.indexOf('warzone') !== -1 || message.indexOf('сквад') !== -1)) {
        if (uptime != null) say('Сейчас стрим. На стримах я играю в соло ')
    } else if (command === 'game') {
        let game = '';
        for (let i in messageSplit) {
            if (messageSplit.indexOf(messageSplit[i]) < 1) continue;
            else if (messageSplit.indexOf(messageSplit[i]) === 1) game += messageSplit[i];
            else if (messageSplit.indexOf(messageSplit[i]) > 1) game += ` ${messageSplit[i]}`;
        }
        if (game === '' || game.length < 3) return;
        hltbService.search(game).then(result => {
            const games = [];
            const array = result;
            for (let i in array) {
                const gameResult = array[i];
                let match = gameResult.similarity;
                match = Math.floor(match * 100)
                if (match > 65) games.push({ match: match, result: gameResult });
            }
            let maxMatch = 0;
            let gameResult = null;
            for (let i in games) {
                if (games[i].match > maxMatch) {
                    maxMatch = games[i].match;
                    gameResult = games[i].result;
                }
            }
            if (gameResult == null) {
                say('Игра не найдена');
                return;
            }
            say(`@${username}, полное прохождение: ${gameResult.gameplayMain}ч. | Сюжет и побочки: ${gameResult.gameplayMainExtra}ч. | 100% прохождение: ${gameResult.gameplayCompletionist}ч.`)
        });
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