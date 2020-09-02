const settings = require('./settings');
const tools = require('./tools');
const botInformation = settings.startBot();
const fs = require("fs");

const client = botInformation.client;
const channelName = botInformation.channelName;
const botName = botInformation.botName;

const chatterInfo = tools.GetChatterInfo();
const PixelPerMessage = 0.5;

const userDossier = {
    username: '',
    mod: {
        warnings: 0,
        timeouts: 0,
        bans: 0,
    },
    amountMessages: 0,
    waitingTimerForPixels: 0,
    amountPixels: 0,
    waitingTimerForGift: 0,
    amountGifts: 0,
};

let emotionsTimer = 0;
const emotionsArray = ['Pog', 'PogChamp', 'LUL', 'Jebaited', 'CoolStoryBob', 'NotLikeThis', 'BibleThump'];

let minePixelTimer = 0;

/**
 * Repeat information about rules on stream
 */
setInterval(function () {
    const rules = `| Правила в чате: Не спамить. Не говорить на тему политики. Не использовать запрещенные слова. Быть хорошим чатером.`;
    client.action(channelName, rules);
}, tools.ConvertTime({ minutes: 15 }));

function ReturningPixels(username) {
    if (minePixelTimer == 0) {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) {
                const pixelInfo = tools.GeneratePixelStory();
                chatterInfo[i].amountPixels += pixelInfo.Amount;
                client.say(channelName, `@${username}, вы вернулись из игровых миров захватив с собой ${pixelInfo.Story}. Торговец дал вам за это ${pixelInfo.Amount} пикселей. Теперь у вас ${chatterInfo[i].amountPixels} пикселей`)
            }
        }
    }
}

function MinePixels(username) {
    let check = 0;
    if (minePixelTimer == 0) {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) {
                if (chatterInfo[i].amountPixels >= 20) {
                    chatterInfo[i].amountPixels -= 20;
                    minePixelTimer = 1;
                    const pixelsWaiting = () => {minePixelTimer = 0; ReturningPixels(username);}
                    time = tools.RandomInt(30, 60);
                    client.say(channelName, `@${username}, оплатив проход в 20 пикселей вы ушли в игровые миры на поиски новых пикселей, удачи вам! Возвращение через ${time} минут`)
                    setTimeout(pixelsWaiting, tools.ConvertTime({seconds: 5}));
                }
            }
        }
    }
}

/**
 * 
 * @param {String} message 
 * @returns {boolean}
 */
function SayEmoties(message) {
    let check = false;
    let emotion;
    if (emotionsTimer == 0) {
        for (i in emotionsArray) {
            if (message.indexOf(emotionsArray[i]) != -1) {
                check = true;
                emotion = emotionsArray[i]
            }
        }
        if (check) {
            client.say(channelName, `${emotion} ${emotion} ${emotion}`)
            emotionsTimer = 1;
            const f = () => emotionsTimer = 0;
            setTimeout(f, tools.ConvertTime({ minutes: 2 }));
        }
    }
}

/**
 * 
 * @param {*} username 
 * @param {*} message 
 */
function InfoAboutGames(username, message) {
    const array = ['во что играешь', 'в какие игры'];
    let check = false;
    for (i in array) {
        if (message.toLowerCase().indexOf(array[i]) != -1) {
            check = true;
        }
    }
    if (check) {
        client.say(channelName, `@${username} во все, что можно. Если есть идея, то можешь написать в чат :)`)
    }
}

/**
 * If user is moderator or author return true, else return false
 * @param {Array} userstate 
 * @returns {boolean} user type
 */
function CheckMod(userstate) { return (userstate['user-type'] != 'mod' && userstate['display-name'] != channelName); }

/**
 * 
 * @param {String} message 
 * @returns {boolean}
 */
function CheckPartyPlay(message) {
    const array = ['давай сыграем', 'будешь пати', 'сыграем вместе', 'в пати', 'сыграй с ', 'в тиму'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    return check;
}

/**
 * 
 * @param {String} message 
 * @returns {boolean}
 */
function CheckWhoAreU(message) {
    const array = ['ты кто', 'ты хто', 'хто ты', 'кто ты', 'что ты', 'ты что', 'ты бот', 'ты человек'];
    const nickname = '@' + botName;
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1 && message.toLowerCase().indexOf(nickname.toLowerCase()) != -1) check = true; }
    return check;
}

/**
 * 
 * @param {String} message 
 * @returns {boolean}
 */
function CheckChangeSub(message) {
    const array = ['взаимная подписку', 'взаимную подписку', 'взаимной подписке'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    return check;
}

client.on("clearchat", (channel) => {
    client.say(channel, `я первый Kappa`)
});

client.on('join', (username) => {
    if (chatterInfo.length != 0) {
        for (i in chatterInfo) {
            if (chatterInfo.username == username) {
                if (chatterInfo[i].amountMessages > 0) client.say(channelName, `@${username}, ${tools.ChooseHelloMessage()}`);
                return;
            }
        };
    }
});

client.on("ban", (channel, username, reason, userstate) => {
    if (chatterInfo.length == 0) {
        let userInfo = userDossier;
        userInfo.username = username;
        userInfo.mod.bans++;
        chatterInfo.push(userInfo);
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) {
                chatterInfo[i].mod.warnings = 0;
                chatterInfo[i].mod.bans++;
            }
            return;
        }
        let userInfo = userDossier;
        userInfo.username = username;
        userInfo.mod.bans++;
        chatterInfo.push(userInfo);
    }
});

client.on("timeout", (channel, username, reason, duration, userstate) => {
    if (chatterInfo.length == 0) {
        let userInfo = userDossier;
        userInfo.username = username;
        userInfo.mod.timeouts++;
        chatterInfo.push(userInfo);
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) {
                chatterInfo[i].mod.warnings = 0;
                chatterInfo[i].mod.timeouts++;
            }
            return;
        }
        let userInfo = userDossier;
        userInfo.username = username;
        userInfo.mod.timeouts++;
        chatterInfo.push(userInfo);
    }
});

client.on("action", (channel, userstate, message, self) => {
    const username = userstate['display-name'];
    if (self) return;
    if (userstate['user-type'] != 'mod' && username != channelName) {
        client.timeout(channel, username, 20, "/me в сообщении");
        client.say(channelName, `@${username} у нас не принято использовать /me в чате!`)
    }
});

function UpdateChatterInfo(username) {
    let check = false;

    if (chatterInfo.length == 0) {
        let userInfo = userDossier;
        userInfo.username = username;
        userInfo.amountMessages++;
        userInfo.amountPixels += 20 + PixelPerMessage;
        chatterInfo.push(userInfo);
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) {
                chatterInfo[i].amountMessages++;
                chatterInfo[i].amountPixels += PixelPerMessage;
                check = true;
            }
        }
        if (check == false) {
            let userInfo = userDossier;
            userInfo.username = username;
            userInfo.amountMessages++;
            userInfo.amountPixels += 20 + PixelPerMessage;
            chatterInfo.push(userInfo);
        }
    }
}

client.on("message", (channel, userstate, message, self) => {
    if (self) return;

    const messageSplit = message.split(" ");
    const username = userstate['display-name']

    UpdateChatterInfo(username)

    switch (messageSplit[0]) {
        case '!шумнафоне':
            client.say(channel, `@${username}, twitch.tv/kartinka_katerinka`);
            break;
        case '!save':
            if (CheckMod(userstate)) {
                tools.SaveChattersInfo(chatterInfo);
                client.say(channel, `сохранено`);
            }
            break;
        case '!pc':
            client.action(channelName, `| iMac 27" 5k retina. Играю на Windows`);
            break;
        case '!pixels':
            client.action(channelName, '| Пиксели - это такая валюта, с помощью которой вы можете заказать челлендж. 1 челендж = 1000 пикселей. Пиксели можно получить просто писав сообщения в чат или попробовать удачу в !minepixels. Узнать свой баланс можно при помощи !balance. Заказать челлендж можно командой !challane [ТЕКСТ]');
            break;
        case '!warband':
            client.action(channelName, '| Цель: обладать 1 замком. Условие: боевой отряд не больше 10 человек не считая ГГ');
            break;
        case '!hitman':
            client.action(channelName, '| Цель: пройти игру. Условие: ни разу не умереть иначе все сначала');
            break;
        case '!minecraft':
            client.action(channelName, '| Цель: выживать как можно дольше. Условие: я не могу строить, а моя девушка ломать, мы никого не убиваем, даже монстров, но играем на сложном уровне, а еще если один из нас умирает, то чтобы "воскресить" ');
            break;
        case '!balance':
            for (i in chatterInfo) {
                if (chatterInfo[i].username == username) client.say(channelName, `@${username}, баланс пикселей: ${chatterInfo[i].amountPixels}`);
            }
            break;
        case '!minepixels':
            MinePixels(username);
            break;
        case '!givepixels':
            if (CheckMod(userstate)) {
                for (i in chatterInfo) {
                    if (chatterInfo[i].username == messageSplit[1]) chatterInfo[i].amountPixels += parseInt(messageSplit[2]);
                }
            }
            break;
        case '!clearpixels':
            if (CheckMod(userstate)) {
                for (i in chatterInfo) {
                    if (chatterInfo[i].username == messageSplit[1]) chatterInfo[i].amountPixels = 0;
                }
            }
            break;
        case '!challange':
            for (i in chatterInfo) {
                if (chatterInfo[i].username == username) {
                    if (chatterInfo[i].amountPixels >= 1000) {
                        chatterInfo[i].amountPixels -= 1000;
                        client.say(channelName, '@JOURlOY, тут челендж заказали. 1000 пикселей списал, посмотри челлендж');
                        console.log(`
=====================================
ЧЕЛЛЕНДЖ
=====================================

${message}

=====================================

                        `);
                    } else {
                        client.say(channelName, `@${username}, у тебя не хватает пикселей, накопи еще ${1000 - chatterInfo[i].amountPixels} пикселей и сможешь заказать`);
                    }
                }
            }
            break;
    }

    if (CheckPartyPlay(message) == true) client.say(channel, `@${username}, стример не любит играть в пати`);
    if (CheckWhoAreU(message) == true) client.say(channel, `@${username}, что за вопросы, ты кто такой? А? Kappa`);
    if (CheckChangeSub(message) == true) client.say(channel, `@${username}, никаких взаимных подписок`);

    SayEmoties(message);
    InfoAboutGames(username, message);
});