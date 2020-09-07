const twitch = require('./TwitchBot');
const discord = require('./DiscordBot');
const tools = require('./tools');
const moment = require('moment');
//const spaceGame = require('./SpaceGame');

//const chattersInfo = tools.GetChattersInfo();

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
const emotionsArray = ['Pog', 'PogChamp', 'LUL', 'Jebaited', 'CoolStoryBob', 'NotLikeThis', 'BibleThump', 'DarkMode', 'Kappa'];

let questionTimer = 0;

let uptime = 'стример сейчас оффлайн';
let oldFollowers = [];

/**
 * Update uptime
 */
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
            if (uptime == `стример сейчас оффлайн`) twitch.say(`чату и стримеру привет`);
            uptime = `| JOURLOY вещает на всю станцию уже ${s}`
        } else {
            if (uptime != `стример сейчас оффлайн`) twitch.action('| всем пока, приходите на следующий стрим! Узнать о новых стримах и не только можно в нашем дискорде: discord.gg/DVukvAu');
            uptime = `стример сейчас оффлайн`;
        }
    });
}, 1000);

/**
 * Check new follows
 */
setInterval(function () {
    twitchClient.api({
        url: "https://api.twitch.tv/kraken/channels/158466757/follows",
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        let followers = [];
        for (i in body.follows) {
            followers.push(body.follows[i].user.display_name);
        }

        if (oldFollowers.length == 0) oldFollowers = followers;
        else {
            for (i in followers) {
                if (!oldFollowers.includes(followers[i])) {
                    twitch.say(`@${followers[i]}, добро пожаловать на орбитальную станцию JOURLOY. Спасибо, что выбрали нас ShowOfHands ShowOfHands`);
                    oldFollowers = followers;
                }
            }
        }
    });
}, 1000);

/**
 * Repeat information about rules on stream
 */
setInterval(function () {
    if (uptime != 'стример сейчас оффлайн') {
        const rules = `| Правила в чате: Не спамить. Не говорить на тему политики. Не использовать запрещенные слова. Быть хорошим чатером. Использовать символы из русского и английского алфавитов и частоиспользуемые символы.`;
        twitch.action(rules);
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
            twitch.say(`${emotion} ${emotion} ${emotion}`)
            emotionsTimer = 1;
            const f = () => emotionsTimer = 0;
            setTimeout(f, tools.ConvertTime({ minutes: 1 }));
        }
    }
}

/**
 * 
 * @param {String} message 
 * @param {String} username 
 */
function InfoAboutGames(message, username) {
    const array = ['во что играешь', 'в какие игры'];
    let check = false;
    for (i in array) {
        if (message.toLowerCase().indexOf(array[i]) != -1) check = true;
    }
    if (check) twitch.say(`@${username} во все, что можно. Если есть идея, то можешь написать в чат :)`);
    return check;
}

/**
 * If user is moderator or author return true, else return false
 * @param {Array} userstate 
 * @returns {boolean} user type
 */
function CheckMod(userstate) { return (userstate['user-type'] != 'mod' && userstate['display-name'] != channelName); }

/**
 * Check message and answer if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckPartyPlay(message, username) {
    const array = ['давай сыграем', 'будешь пати', 'сыграем вместе', 'в пати', 'сыграй с ', 'в тиму'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, стример не любит играть в пати`);
    return check;
}

/**
 * Check message and answer if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckWhoAreU(message, username) {
    const array = ['ты кто', 'ты хто', 'хто ты', 'кто ты', 'что ты', 'ты что', 'ты бот', 'ты человек'];
    const nickname = '@' + botName;
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1 && message.toLowerCase().indexOf(nickname.toLowerCase()) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, что за вопросы, ты кто такой? А? Kappa`);
    return check;
}

/**
 * Check message and answer if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckChangeSub(message, username) {
    const array = ['взаимная подписку', 'взаимную подписку', 'взаимной подписке'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, никаких взаимных подписок`);
    return check;
}

/**
 * Check message and ban user if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckBannedWords(message, username) {
    const array = ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 'конча', 'хиджаб', 'нига', 'хохлы', 'хохол'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitchClient.timeout(channelName, username, tools.ConvertTime({hours: 24}), 'запретное слово');
    return check;
}

/**
 * 
 * @param {String} message 
 * @param {String} username 
 */
function HiMessage(message, username) {
    const array = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, ${tools.ChooseHiMessage()}`);
    return check;
}

/**
 * Reaction when chat has been cleared
 */
twitchClient.on("clearchat", (channel) => {
    twitchClient.say(channel, `я первый Kappa`)
});

/**
 * Reaction when user has been banned
 */
twitchClient.on("ban", (channel, username, reason, userstate) => {
    if (chatterInfo.length != 0) {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == username) chatterInfo.slice(i, i);
        }
    }
});

/**
 * Reaction when user send /me message in chat
 */
twitchClient.on("action", (channel, userstate, message, self) => {
    const username = userstate['display-name'];
    if (self) return;
    if (userstate['user-type'] != 'mod' && username != channelName) {
        twitchClient.timeout(channel, username, toole.ConvertTime({seconds: 5}), "/me в сообщении");
        twitch.say(`@${username} у нас не принято использовать /me в чате!`);
    }
});

/**
 * Add user in chatterInfo
 * @param {String} username 
 */
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

    //if (tools.CheckString(message) == true) twitchClient.ban(channelName, username, 'запрещенные символы');
    if (HiMessage(message, username) == true) return;
    if (CheckBannedWords(message) == true) return;
    if (CheckPartyPlay(message, username) == true) return;
    if (CheckWhoAreU(message, username) == true) return;
    if (CheckChangeSub(message, username) == true) return;
    if (InfoAboutGames(message, username) == true) return;

    switch (messageSplit[0]) {
        case '!шумнафоне':
            twitchClient.say(channel, `@${username}, twitch.tv/kartinka_katerinka`);
            return;
        case '!save':
            if (CheckMod(userstate)) {
                tools.SaveChattersInfo(chatterInfo);
                twitchClient.say(channel, `сохранено`);
            }
            return;
        case '!pc':
            twitch.action(`| iMac 27" 5k retina. Играю на Windows`);
            return;
        case '!warband':
            twitch.action('| Цель: обладать 1 замком. Условие: боевой отряд не больше 10 человек не считая ГГ');
            return;
        case '!hitman':
            twitch.action('| Цель: пройти игру. Условие: ни разу не умереть иначе все сначала');
            return;
        case '!minecraft':
            twitch.action('| Цель: выживать как можно дольше. Условие: я не могу строить, а моя девушка ломать, мы никого не убиваем, даже монстров, но играем на сложном уровне, а еще если один из нас умирает, то чтобы "воскресить" ');
            return;
        case '!q':
            if (questionTimer == 0 && message.includes('?') && message.length > 5) {
                twitch.say(`@${username}, ${tools.ChooseAnswer()}`);
                questionTimer = 1;
                const setQuestionTime = () => questionTimer = 0;
                setTimeout(setQuestionTime, tools.ConvertTime({ seconds: 30 }));
            }
            return;
        case '!uptime':
            twitch.action(`${uptime}`);
            return;
        case '!t':
            if (CheckMod) {
                if (twitch.timeout(messageSplit[1], messageSplit[2]) == -1) console.log(`Человек с ником [ ${messageSplit[1]} ] не найден`);
            }
            return;
        case '!b':
            if (CheckMod) {
                if (twitch.ban(messageSplit[1]) == -1) console.log(`Человек с ником [ ${messageSplit[1]} ] не найден`);
            }
            return;     
    }

    SayEmoties(message);
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
