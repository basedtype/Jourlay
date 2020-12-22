
const TelegramBot = require('node-telegram-bot-api');
const { JsonDB } = require('node-json-db');
const conf = require('./conf');

const nodeDB = new JsonDB('Data/Users', true, true, '/');
const bot = new TelegramBot(conf.token, {polling: true});

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
        for (let i in chatID) {
            this.send(chatID[i], 'Привет! А тут стрим идет. Залетай давай, все тебя ждут => twitch.com/jourloy')
        }
    }
}

try {
    const a = nodeDB.getData('/chatID');
} catch {
    database.create();
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text.toLowerCase();
    if (message === '/start') {
        database.push(chatId);
        telegram.send(chatId, 'Уведомления подключены')
    }
    if (message === '/test') {
        telegram.notification();
    }
});

module.exports.telegram = telegram;