const telegramBot = require('node-telegram-bot-api');
const conf = require('./conf');

const bot = new telegramBot(conf.token, {polling: true});
const channelID = '-1001428389383';
const sandboxID = '-1001337784477';

const keyboard = [
    [
        {
            text: 'Перейти на трансляцию',
            url: 'https://www.twitch.tv/jourloy'
        }
    ]
];

bot.on('channel_post', (msg) => {
    telegram.sandboxSendPhoto(msg.chat.id);
})

class telegram {
    static send(message) {
        bot.sendMessage(channelID, message);
    }

    static sandboxSend(message) {
        bot.sendMessage(sandboxID, message);
    }

    static noftification(game) {
        if (game == null) {
            bot.sendMessage(channelID, 'Стрим начинается прямо сейчас, а тебя там еще нет!', {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
        }
    }
}

module.exports.telegram = telegram;