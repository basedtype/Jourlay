const twitch = require('./TwitchBot');
const discord = require('./DiscordBot');
const tools = require('./tools');
const moment = require('moment');
//const spaceGame = require('./SpaceGame');
const https = require('https');

//const chattersInfo = tools.GetChattersInfo();
let uptime;


//  ================== ================== ================== ================== TWITCH ================== ================== ================== ==================

const twitchClient = twitch.start()
const channelName = twitch.getChannelName();
const botName = twitch.getBotName();

const chatterInfo = tools.GetChatterInfo();

const userDossier = {
    username: '',
    isks: 0,
    userShip: [],
    userInventory: [],
    iskMineTimer: 0,
};

let emotionsTimer = 0;
const emotionsArray = ['Pog', 'PogChamp', 'LUL', 'Jebaited', 'CoolStoryBob', 'NotLikeThis', 'BibleThump'];

setInterval(function () {
    twitchClient.api({
        url: "https://api.twitch.tv/kraken/streams/158466757/",
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        if (body.stream != null) {
            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            let s = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин.");
            uptime = `JOURLOY вещает на всю станцию уже ${s}`
        } else uptime = `стример сейчас оффлайн`
    });
}, 1000);

/**
 * Repeat information about rules on stream
 */
setInterval(function () {
    if (uptime != 'стример сейчас оффлайн') {
        const rules = `| Правила в чате: Не спамить. Не говорить на тему политики. Не использовать запрещенные слова. Быть хорошим чатером.`;
        twitchClient.action(channelName, rules);
    }
}, tools.ConvertTime({ minutes: 40 }));

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
            twitchClient.say(channelName, `${emotion} ${emotion} ${emotion}`)
            emotionsTimer = 1;
            const f = () => emotionsTimer = 0;
            setTimeout(f, tools.ConvertTime({ minutes: 1 }));
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
        twitchClient.say(channelName, `@${username} во все, что можно. Если есть идея, то можешь написать в чат :)`)
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

twitchClient.on("clearchat", (channel) => {
    twitchClient.say(channel, `я первый Kappa`)
});

twitchClient.on('join', (username) => {
    if (chatterInfo.length != 0) {
        for (i in chatterInfo) {
            if (chatterInfo.username == username) {
                if (chatterInfo[i].amountMessages > 0) twitchClient.say(channelName, `@${username}, ${tools.ChooseHelloMessage()}`);
                return;
            }
        };
    }
});

twitchClient.on("ban", (channel, username, reason, userstate) => {
    if (chatterInfo.length != 0) {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) chatterInfo.slice(i, i);
        }
    }
});

/* twitchClient.on("timeout", (channel, username, reason, duration, userstate) => {
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
}); */

twitchClient.on("action", (channel, userstate, message, self) => {
    const username = userstate['display-name'];
    if (self) return;
    if (userstate['user-type'] != 'mod' && username != channelName) {
        twitchClient.timeout(channel, username, 20, "/me в сообщении");
        twitchClient.say(channelName, `@${username} у нас не принято использовать /me в чате!`)
    }
});

function UpdateChatterInfo(username) {
    let check = false;

    if (chatterInfo.length == 0) {
        let userInfo = userDossier;
        userInfo.username = username;
        chatterInfo.push(userInfo);
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) check = true;
        }
        if (check == false) {
            let userInfo = userDossier;
            userInfo.username = username;
            chatterInfo.push(userInfo);
        }
    }
}

twitchClient.on("message", (channel, userstate, message, self) => {
    if (self) return;

    const messageSplit = message.split(" ");
    const username = userstate['display-name']

    UpdateChatterInfo(username)

    switch (messageSplit[0]) {
        case '!шумнафоне':
            twitchClient.say(channel, `@${username}, twitch.tv/kartinka_katerinka`);
            break;
        case '!save':
            if (CheckMod(userstate)) {
                tools.SaveChattersInfo(chatterInfo);
                twitchClient.say(channel, `сохранено`);
            }
            break;
        case '!pc':
            twitchClient.action(channelName, `| iMac 27" 5k retina. Играю на Windows`);
            break;
        /* case '!pixels':
            twitchClient.action(channelName, '| Пиксели - это такая валюта, с помощью которой вы можете заказать челлендж. 1 челендж = 1000 пикселей. Пиксели можно получить просто писав сообщения в чат или попробовать удачу в !minepixels. Узнать свой баланс можно при помощи !balance. Заказать челлендж можно командой !challane [ТЕКСТ]');
            break; */
        case '!warband':
            twitchClient.action(channelName, '| Цель: обладать 1 замком. Условие: боевой отряд не больше 10 человек не считая ГГ');
            break;
        case '!hitman':
            twitchClient.action(channelName, '| Цель: пройти игру. Условие: ни разу не умереть иначе все сначала');
            break;
        case '!minecraft':
            twitchClient.action(channelName, '| Цель: выживать как можно дольше. Условие: я не могу строить, а моя девушка ломать, мы никого не убиваем, даже монстров, но играем на сложном уровне, а еще если один из нас умирает, то чтобы "воскресить" ');
            break;
        case '!q':
            twitchClient.say(channelName, `@${username}, ${tools.ChooseAnswer()}`);
            break;
        case '!uptime':
            twitchClient.action(channelName, `${uptime}`);
            break;
        /* case '!balance':
            for (i in chatterInfo) {
                if (chatterInfo[i].username == username) twitchClient.say(channelName, `@${username}, баланс пикселей: ${chatterInfo[i].amountPixels}`);
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
                        twitchClient.say(channelName, '@JOURlOY, тут челендж заказали. 1000 пикселей списал, посмотри челлендж');
                        console.log(`
=====================================
ЧЕЛЛЕНДЖ
=====================================

${message}

=====================================

                        `);
                    } else {
                        twitchClient.say(channelName, `@${username}, у тебя не хватает пикселей, накопи еще ${1000 - chatterInfo[i].amountPixels} пикселей и сможешь заказать`);
                    }
                }
            }
            break; */
    }

    if (CheckPartyPlay(message) == true) twitchClient.say(channel, `@${username}, стример не любит играть в пати`);
    if (CheckWhoAreU(message) == true) twitchClient.say(channel, `@${username}, что за вопросы, ты кто такой? А? Kappa`);
    if (CheckChangeSub(message) == true) twitchClient.say(channel, `@${username}, никаких взаимных подписок`);

    SayEmoties(message);
    InfoAboutGames(username, message);
});

//  ================== ================== ================== ================== DISCORD ================== ================== ================== ==================

discordClient = discord.start()
discordClient.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});
