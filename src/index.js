const tools = require('./Tools/tools');
const twitch = require('./Twitch/twitch');
const moment = require('moment');
const settings = require('./Settings/settings');

const twitchClient = twitch.start()
const channelName = twitch.getChannelName();
const botName = twitch.getBotName();
//const chatters = twitch.db.get();
const lang = 'ru';

const pattern = {
    sub: false, // State of subscriber
    balance: 0, // Amount of Pixels
    message: 0, // Amount of messages
}

let emotions = {
    timer: 0,
    array: ['Pog', 'PogChamp', 'LUL', 'Jebaited', 'CoolStoryBob', 'NotLikeThis', 'BibleThump', 'DarkMode', 'Kappa', 'LOL', ':D', 'D:', 'KEKW', 'OmegaLOL', '4HEader', '2HEader', 'Lois']
};

let ask = {
    timer: 0,
};

let twitchInfo = {
    viewers: 0,
    maxViewers: 0,
    game: 'None',
    maxGame: 'None',
    uptime: settings.offline(lang),
    commands: 0,
    chatClears: 0,
    bans: 0,
    timeouts: 0,
    messages: 0,
};

let oldFollowers = [];
let hiMans = [];

// == == == == == == == == == == == == INTERVALS == == == == == == == == == == == == \\

/**
 * Print stream information in console
 */
setInterval(function () {
    try {
        tools.ClearCli();
        console.log(tools.TwitchIcon());
        console.log(`
Channel name: ${channelName}

╔══ Stream info
╠ Uptime: ${twitchInfo.uptime}
╠ Viewers: ${twitchInfo.viewers}
╠ Game: ${twitchInfo.game}
╠══ Stream stats
╠ Max viewers: ${twitchInfo.maxViewers}
╠ Game with max viewers: ${twitchInfo.maxGame}
╠══ Chat stats
╠ Used commands: ${twitchInfo.commands}
╠ Chat clears: ${twitchInfo.chatClears}
╠ Bans: ${twitchInfo.bans}
╠ Timeouts: ${twitchInfo.timeouts}
╠ Messages: ${twitchInfo.messages}
╚══`)
    } catch { ; }
}, tools.ConvertTime({seconds: 5}));

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
            try {
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
                    twitchInfo.uptime = settings.offline(lang);
                }
            } catch { ; }
        });
    } catch { twitchInfo.uptime = settings.offline(lang); }
}, tools.ConvertTime({seconds: 1}));

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
                            twitch.say(`@${followers[i]}, ${settings.follow(lang)}`);
                            oldFollowers = followers;
                        }
                    }
                }
            }
        });
    } catch { ; }
}, tools.ConvertTime({seconds: 1}));

/**
 * Repeat information about rules on stream
 */
setInterval(function () {
    try {
        if (twitchInfo.uptime != settings.offline(lang) && twitchInfo.viewers > 3) {
            const rules = `| ${settings.rules(lang)}`;
            twitch.action(rules);
        }
    } catch { ; }
}, tools.ConvertTime({ minutes: 40 }));

/**
 * Repeat information about links on stream
 */
setInterval(function () {
    try {
        if (twitchInfo.uptime != settings.offline(lang) && twitchInfo.viewers > 3) {
            const rules = `| ${settings.diskord(lang)}`;
            //twitch.action(rules);
        }
    } catch { ; }
}, tools.ConvertTime({ minutes: 50 }));

/**
 * Repeat emotions in chat
 * @param {String} message
 * @returns {boolean}
 */
function SayEmoties(message) {
    let check = false;
    let emotion;
    if (emotions.timer == 0) {
        for (i in emotions.array) {
            if (message.indexOf(emotions.array[i]) != -1) {
                check = true;
                emotion = emotions.array[i]
            }
        }
        if (check) {
            twitch.say(`${emotion} ${emotion} ${emotion}`)
            emotions.timer = 1;
            const f = () => emotions.timer = 0;
            setTimeout(f, tools.ConvertTime({ minutes: 1 }));
        }
    }
}

/**
 * Send message in chat about games
 * @param {String} message
 * @param {String} username
 */
function InfoAboutGames(message, username) {
    const array = ['во что играешь', 'в какие игры'];
    let check = false;
    for (i in array) if (message.toLowerCase().indexOf(array[i]) != -1) check = true;
    if (check) twitch.say(`@${username} ${settings.games(lang)}`);
    return check;
}

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
    const array = settings.whoAreYou(lang, 'ask');
    const nickname = '@' + botName;
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1 && message.toLowerCase().indexOf(nickname.toLowerCase()) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, ${settings.whoAreYou(lang, 'answer')}`);
    return check;
}


/**
 * Check message and answer if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckWhereIsKate(message, username) {
    const answer = settings.whereIsKate(lang, 'answer');
    const array = settings.whereIsKate(lang, 'ask');
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1 && message.toLowerCase().indexOf(nickname.toLowerCase()) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, ${tools.GetRandomElementFromArray(answer)}`);
    return check;
}

/**
 * Check message and answer if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckWhen(message, username) {
    const answer = ['завтра', 'когда рак на горе свистнет Kappa', 'через 7 минут', 'через 30 минут', 'послезавтра', 'в следующем году', 'в следующем месяца', 'тогда'];
    const array = ['когда'];
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitch.say(`@${username}, ${tools.GetRandomElementFromArray(answer)}`);
    return check;
}

/**
 * TODO add text in settings
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
 * TODO add text in settings
 * Check message and ban user if need
 * @param {String} message
 * @param {String} username
 * @returns {boolean}
 */
function CheckBannedWords(message, username) {
    const array = tools.GetBannedWords();
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitchClient.ban(channelName, username, 'бан [БОТ]');
    return check;
}

/**
 * TODO add text in settings
 * Check message and answer user if need
 * @param {String} message
 * @param {String} username
 */
function HiMessage(message, username) {
    const array = settings.hiMessage(lang);
    let check = false;
    if (!hiMans.includes(username) /* && username.toLocaleLowerCase() != channelName */) {
        for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
        if (check == true) {
            twitch.say(`@${username}, ${tools.ChooseHiMessage()} ShowOfHands ShowOfHands`);
            hiMans.push(username);
        }
    }
    return check;
}

/**
 * TODO add text in settings
 * Check message and ban user if need
 * @param {String} message 
 */
function CheckSetPlus(message) {
    const array = settings.setPlus(lang)
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) twitch.say(`+`);
    return check;
}

/**
 * TODO add text in settings
 * Reaction when chat has been cleared
 */
twitchClient.on("clearchat", (channel) => {
    twitchClient.say(channel, settings.chatCleared(lang));
    twitchInfo.chatClears++;
});

/**
 * Reaction when user has been banned
 */
twitchClient.on("ban", (channel, username, reason, userstate) => { 
    twitchInfo.bans++; 
    twitch.db.delete(username);
});

/**
 * Reaction when user has been timeout
 */
twitchClient.on('timeout', (channel, username, reason, duration, userstate) => { twitchInfo.timeouts++; })

/**
 * TODO add text in settings
 * Reaction when user send /me message in chat
 */
twitchClient.on("action", (channel, userstate, message, self) => {
    const username = userstate['display-name'];
    if (self) return;
    if (!twitch.CheckMod(userstate)) twitchClient.timeout(channel, username, toole.ConvertTime({seconds: 5}), "/me в сообщении");
});

twitchClient.on("message", (channel, userstate, message, self) => {
    if (self) return;

    const messageSplit = message.split(" ");
    const username = userstate['display-name'].toLowerCase();

    let userInfo = twitch.db.get(username);
    if (userInfo == false) userInfo = pattern;
    userInfo.message++;
    twitch.db.push(username, userInfo);

    let userData;

    if (tools.CheckString(message) == true) {
        twitch.ban(username, 'без возможности разбана [БОТ]')
        twitch.clearChat();
        return;
    }
    if (CheckBannedWords(message) == true) return;
    twitchInfo.messages++;
    if (HiMessage(message, username) == true) return;
    if (CheckPartyPlay(message, username) == true) return;
    if (CheckWhoAreU(message, username) == true) return;
    if (CheckChangeSub(message, username) == true) return;
    if (InfoAboutGames(message, username) == true) return;
    if (CheckWhereIsKate(message, username) == true) return;
    if (CheckWhen(message, username) == true) return;
    if (CheckSetPlus(message, username) == true) return;

    switch (messageSplit[0]) {
        case '!шумнафоне':
            twitchClient.say(channel, `@${username}, twitch.tv/kartinka_katerinka`);
            twitchInfo.commands++;
            return;
        case '!pc':
            twitch.action(`| iMac 27" 5k retina. Играю на Windows`);
            twitchInfo.commands++;
            return;
        case '!warband':
            //twitch.action('| Цель: обладать 1 замком. Условие: боевой отряд не больше 10 человек не считая ГГ');
            twitchInfo.commands++;
            return;
        case '!hitman':
            //twitch.action('| Цель: пройти игру. Условие: ни разу не умереть, иначе все сначала');
            twitchInfo.commands++;
            return;
        case '!minecraft':
            //twitch.action('| Цель: выживать как можно дольше. Условие: я не могу строить, а моя девушка ломать, мы никого не убиваем, даже монстров, но играем на сложном уровне, а еще если один из нас умирает, то чтобы "воскресить" ');
            twitchInfo.commands++;
            return;
        case '!q':
            if (username == channelName) twitch.say(`@${username}, ${tools.ChooseAnswer()}`);
            else if (twitchInfo && twitchInfo.viewers < 100) {
                if (ask.timer == 0 && message.includes('?') && message.length > 6) {
                    twitch.say(`@${username}, ${tools.ChooseAnswer()}`);
                    ask.timer = 1;
                    const setQuestionTime = () => ask.timer = 0;
                    setTimeout(setQuestionTime, tools.ConvertTime({ seconds: 15 }));
                    twitchInfo.commands++;
                }
            }
            return;
        case '!up':
        case '!uptime':
            try {
                if (twitchInfo.uptime != settings.offline) twitch.action(`| JOURLOY вещает на всю станцию уже ${twitchInfo.uptime} | Максимальное количество зрителей на стриме: ${twitchInfo.maxViewers} во время игры: ${twitchInfo.maxGame}`);
                else twitch.action(twitchInfo.uptime);
            } catch { ; }
            twitchInfo.commands++;
            return;
        /* case '!10hoursgames':
            twitch.action(`| сегодня мы можем поиграть в The Cycle, Spellbreak, Into the Breach, Starcraft 2, Overwatch, Minecraft, Call of Duty Modern Warfare, Sea of Thieves, Mount&Blade: Warband`);
            return; */
        case `!dis`:
        case `!discord`:
            twitch.action(`| discord.gg/DVukvAu`);
            twitchInfo.commands++;
            return;
        case `!wow`:
        case `!wowC`:
            twitch.action(`| Я апаю мага до 60 лвл. В основном хочу использовать AoE прокачку`);
            twitchInfo.commands++;
            return;
        case `!ping`:
            if (!twitch.CheckMod(userstate)) return;
            twitch.action('pong');
            return;
        case `!test`:
        case `!hack`:
            return;
            if (!twitch.CheckMod(userstate)) return;
            for (i in chatterInfo) if (chatterInfo[i].username.toLowerCase() == username) userData = chatterInfo[i];
            if (userData.hackTimer == 0) {
                const info = hack.Hack(username);
                //if (info.target.username != 'None') twitch.say(`@${username}, вы заказали взлом @${info.target.username}. Все будет сделано через ${info.timer} минут`);
                //else twitch.say(`@${username}, вы заказали взлом случайной цели. Все будет сделано через ${info.timer} минут`);
                if (info.target.username != 'None') twitch.say(`@${username}, ${info.target.username}. ${info.timer}`);
                else twitch.say(`@${username}, ${info.timer}`);
                userData.hackTimer = 1;
                const setQuestionTime = () => {
                    userData.hackTimer = 0;
                    userData.coins += parseFloat(info.getCoins);
                    twitch.say(`@${username}, ${info.getCoins}`)
                }
                setTimeout(setQuestionTime, tools.ConvertTime({ seconds: 1 }));
                twitchInfo.commands++;
            } else twitch.say(userData.hackTimer);
            return;
        case `!b`:
        case `!balance`:
            return;
            if (!twitch.CheckMod(userstate)) return;
            for (i in chatterInfo) if (chatterInfo[i].username.toLowerCase() == username) userData = chatterInfo[i];
            //twitch.say(`@${username}, ваш баланс: ${userData.coins} байткоинов`);
            twitch.say(`@${username}, ${userData.coins} `);
            return;
    }

    SayEmoties(message);
});