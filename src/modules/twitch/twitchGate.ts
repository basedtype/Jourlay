import { twitchFetch } from "./twitchFetch";
import { manager } from "../database/main";
import { defence } from "../defence/main";
import { client, admin } from "./main";

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';

const hltbService = new HowLongToBeatService();
let channelsConnecting = [];

function say(channel: string, text: string) {
    client.say(channel, text);
}

setInterval(() => {
    manager.scoutGetAll().then((data) => {
        if (data == null) return;
        for (let i in data) {
            if (channelsConnecting.includes(data[i].username) === false) {
                client.join(data[i].username);
                channelsConnecting.push(data[i].username);
            }
        }
    })
}, 1000)

client.on('message', async (channel, userstate, message, self) => {
    if (self) return;
    if (channel === '#jourloy') return;

    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];
    const id = await twitchFetch.getUserID(username);

    if (command === 'ping') client.say(channel, 'pong');
    else if (command === 'game') {
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
                say(channel, 'Игра не найдена');
                return;
            }
            say(channel, `@${username}, полное прохождение: ${gameResult.gameplayMain}ч. | Сюжет и побочки: ${gameResult.gameplayMainExtra}ч. | 100% прохождение: ${gameResult.gameplayCompletionist}ч.`)
        });
    }
})