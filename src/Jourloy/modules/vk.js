const VkBot = require('node-vk-bot-api');
const conf = require('./conf');

const bot = new VkBot(conf.vk_token);

bot.on((ctx) => { 
    const text = ctx.message.body.toLowerCase();
    
    if (text == 'пример команды') ctx.reply(`Это пример ответа на команду пользователя. В { } можно вставить любую логику`);
    else if (text == 'придумай пароль') ctx.reply(`Вот ваш пароль: ${GeneratePassword(15)}`);
    else if (text == 'привет') {
        const array = ['привет', 'приветули', 'хелло', 'хаюшки'];
        ctx.reply(`${GetRandomElementFromArray(array)}`);
    }
    else if (text == 'спасибо') {
        const array = ['на здоровье', 'не за что', 'пожалуйста', 'приходи еще'];
        ctx.reply(`${GetRandomElementFromArray(array)}`);
    }
});

bot.startPolling();
console.log(`Bot => VK => Ready`)