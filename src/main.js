const twitch = require('./TwitchBot');
const discord = require('./DiscordBot');
const tools = require('./tools');
const moment = require('moment');
//const spaceGame = require('./SpaceGame');

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

let twitchInfo = {viewers: 0, maxViewers: 0, game: '', maxGame: '', uptime: 'стример сейчас оффлайн'};
let oldFollowers = [];

let hiMans = [];

let streamAims = {
    5: {
        done: false,
        message: '5 зрителей *галочка*'
    },
    10: {
        done: false,
        message: '10 зрителей *галочка*'
    },
    15: {
        done: false,
        message: '15 зрителей *галочка*'
    },
    20: {
        done: false,
        message: '20 зрителей *галочка*'
    },
    25: {
        done: false,
        message: '25 зрителей *галочка*. Офай стрим Kappa'
    },
}

setInterval(function () {
    try {
        if (twitchInfo.viewers) {
            if (twitchInfo.viewers >= 25 && streamAims[25].done == false) {
                streamAims[25].done = true;
                twitch.action(streamAims[20].message)
            } else if (twitchInfo.viewers >= 20 && streamAims[20].done == false) {
                streamAims[20].done = true;
                twitch.action(streamAims[20].message)
            } else if (twitchInfo.viewers >= 15 && streamAims[15].done == false) {
                streamAims[15].done = true;
                twitch.action(streamAims[20].message)
            } else if (twitchInfo.viewers >= 10 && streamAims[10].done == false) {
                streamAims[10].done = true;
                twitch.action(streamAims[20].message)
            } else if (twitchInfo.viewers >= 5 && streamAims[5].done == false) {
                streamAims[5].done = true;
                twitch.action(streamAims[5].message)
            }
        }
    } catch { ; }
}, 2000);

setInterval(function () {
    try {
        tools.ClearCli();
        console.log(tools.twitchIcon);
        console.log(`╔ Stats`)
        console.log(`╚ Max viewers (${twitchInfo.maxViewers}) on this game: ${twitchInfo.maxGame}`);
    } catch { ; }
}, 2000);

/**
 * Update uptime
 */
setInterval(function () {
    try {
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
                if (body.stream.viewers > twitchInfo.maxViewers) {
                    twitchInfo.maxViewers = body.stream.viewers;
                    twitchInfo.maxGame = body.stream.game;
                }
                twitchInfo.viewers = body.stream.viewers;
                twitchInfo.game = body.stream.game;
                let now = new Date();
                let then = body.stream.created_at;
                let ms = moment(now).diff(moment(then));
                let d = moment.duration(ms);
                twitchInfo.uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин.");
            } else {
                //if (uptime != `стример сейчас оффлайн`) twitch.action('| всем пока, приходите на следующий стрим! Узнать о новых стримах и не только можно в нашем дискорде: discord.gg/DVukvAu');
                twitchInfo.uptime = `стример сейчас оффлайн`;
            }
        });
    } catch {
        twitchInfo.uptime = `стример сейчас оффлайн`;
    }
}, 1000);

/**
 * Check new follows
 */
setInterval(function () {
    try {
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
            if (body && body.followers) {
                for (i in body.follows) followers.push(body.follows[i].user.display_name);
                if (oldFollowers.length == 0) oldFollowers = followers;
                else {
                    for (i in followers) {
                        if (!oldFollowers.includes(followers[i])) {
                            twitch.say(`@${followers[i]}, добро пожаловать на орбитальную станцию JOURLOY. Спасибо, что выбрали нас ShowOfHands ShowOfHands`);
                            oldFollowers = followers;
                        }
                    }
                }
            }
        });
    } catch { ; }
}, 1000);

/**
 * Repeat information about rules on stream
 */
setInterval(function () {
    try {
        if (twitchInfo.uptime != 'стример сейчас оффлайн') {
            const rules = `| Правила в чате: Не спамить. Не говорить на тему политики. Не использовать запрещенные слова. Быть хорошим чатером.`;
            twitch.action(rules);
        }
    } catch { ; }
}, tools.ConvertTime({ minutes: 40 }));

/**
 * Repeat information about links on stream
 */
setInterval(function () {
    try {
        if (twitchInfo.uptime != 'стример сейчас оффлайн') {
            const rules = `| Подключайся по ссылке discord.gg/DVukvAu к discord серверу чтобы быть в курсе всего.`;
            twitch.action(rules);
        }
    } catch { ; }
}, tools.ConvertTime({ minutes: 30 }));

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
    const array = tools.GetBannedWords();
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitchClient.ban(channelName, username, 'без возможности разбана [БОТ]');
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
    if (!hiMans.includes(username) && username.toLocaleLowerCase() != channelName) {
        for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
        if (check == true) {
            twitch.say(`@${username}, ${tools.ChooseHiMessage()} ShowOfHands ShowOfHands`);
            hiMans.push(username);
        }
    }
    return check;
}

/**
 * Reaction when chat has been cleared
 */
twitchClient.on("clearchat", (channel) => { twitchClient.say(channel, `я первый Kappa`) });

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
    if (userstate['user-type'] != 'mod' && username != channelName) twitchClient.timeout(channel, username, toole.ConvertTime({seconds: 5}), "/me в сообщении");
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

    if (tools.CheckString(message) == true) {
        twitchClient.ban(channelName, username, 'без возможности разбана [БОТ]');
        return;
    }
    if (CheckBannedWords(message) == true) return;
    if (HiMessage(message, username) == true) return;
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
            //twitch.action('| Цель: обладать 1 замком. Условие: боевой отряд не больше 10 человек не считая ГГ');
            return;
        case '!hitman':
            //twitch.action('| Цель: пройти игру. Условие: ни разу не умереть, иначе все сначала');
            return;
        case '!minecraft':
            //twitch.action('| Цель: выживать как можно дольше. Условие: я не могу строить, а моя девушка ломать, мы никого не убиваем, даже монстров, но играем на сложном уровне, а еще если один из нас умирает, то чтобы "воскресить" ');
            return;
        case '!q':
            if (twitchInfo && twitchInfo.viewers < 100) {
                if (questionTimer == 0 && message.includes('?') && message.length > 6) {
                    twitch.say(`@${username}, ${tools.ChooseAnswer()}`);
                    questionTimer = 1;
                    const setQuestionTime = () => questionTimer = 0;
                    setTimeout(setQuestionTime, tools.ConvertTime({ seconds: 30 }));
                }
            }
            return;
        case '!up':
        case '!uptime':
            try {
                if (twitchInfo.uptime != 'стример сейчас офлайн') twitch.action(`| JOURLOY вещает на всю станцию уже ${twitchInfo.uptime} | Максимальное количество зрителей на стриме: ${twitchInfo.maxViewers} во время игры: ${twitchInfo.maxGame}`);
                else twitch.action(twitchInfo.uptime);
            } catch { ; }
            return;
        /* case '!10hoursgames':
            twitch.action(`| сегодня мы можем поиграть в The Cycle, Spellbreak, Into the Breach, Starcraft 2, Overwatch, Minecraft, Call of Duty Modern Warfare, Sea of Thieves, Mount&Blade: Warband`);
            return; */
        case `!dis`:
        case `!discord`:
            twitch.action(`| discord.gg/DVukvAu`);
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
