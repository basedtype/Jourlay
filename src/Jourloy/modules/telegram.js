const TelegramBot = require('node-telegram-bot-api');
const { JsonDB } = require('node-json-db');
const { _, _twitch } = require('../tools');
const conf = require('./conf');

const nodeDB = new JsonDB('Data/Users', true, true, '/');
const bot = new TelegramBot(conf.tg_token, {polling: true});
_.clearCli()
console.log('Bot => Telegram => Ready');

class database {
    static create() {
        nodeDB.push(`/chatID`, {ID: []});
        return 0;
    }

    static push(chatID) {
        const array = nodeDB.getData('/chatID').ID
        if (array.includes(chatID)) return 0;
        array.push(chatID);
        nodeDB.push(`/chatID`, {ID: array}, true);
        return 0;
    }

    static get() {
        return nodeDB.getData('/chatID').ID;
    }
}

class telegram {
    static send(chatID, message) {
        bot.sendMessage(chatID, `${message}`);
    }

    static notification() {
        const chatID = nodeDB.getData('/chatID').ID;
        console.log('Bot => Telegram => Noftification => Start');
        for (let i in chatID) {
            if (chatID !== 466761645) {
                this.send(chatID[i], 'Ку-ку! Тут стрим запустился, а тебя нет среди зрителей. Залетай => twitch.com/jourloy');
                console.log(`Bot => Telegram => Noftification => Send (${chatID[i]})`);
            } else console.log(`Bot => Telegram => Noftification => *Send (466761645)*`);
        }
        console.log('Bot => Telegram => Noftification => End');
    }
}

try { nodeDB.getData('/chatID') } catch { database.create() }

module.exports.telegram = telegram;
module.exports.tg = bot;