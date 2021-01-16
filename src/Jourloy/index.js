const { client, twitch } = require('./modules/twitch');
const { telegram, tg } = require('./modules/telegram');
const { discord, ds } = require('./modules/discord');
const { _, _twitch } = require('./tools');
const moment = require('moment');
const { JsonDB } = require('node-json-db');

const voteDB = new JsonDB('Data/votes', true, true, '/');

/* PARAMS */

let uptime = undefined;
let viewers = 0;
let maxViewers = 0;
let game = undefined;

let arrays = {
    hi: [],
    vote: [],
    users: [],
}
const timers = {
    hi: 0,
    ask: 0,
    pc: 0,
    socAD: 0,
    vote: 0,
    bigBrain: 0,
    roulette: 0,
}

/* CLASS */

class user {
    constructor(username, id) {
        this.username = username;
        this.id = id;
        this.timers = {
            ask: 0,
            pc: 0,
            socAD: 0,
            bigBrain: 0,
            roulette: 0,
        }
        this.counters = {
            followerAge: 0,
        }

        arrays.users.push(this);
    }
}

/* INTERVALS */

setInterval(function () {
    client.api({
        url: `https://api.twitch.tv/kraken/streams/158466757`,
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        if (body.stream == null) uptime = 'Стример сейчас оффлайн';
        else if (body != null && body.stream != null) {
            viewers = body.stream.viewers;
            if (viewers > maxViewers) maxViewers = viewers;
            game = body.stream.game;

            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин. ss сек.");
        }
    })
}, _.convertTime(seconds=1));

setInterval(function () {
    if (uptime != null && game != null) {
        const splitedUptime = uptime.split(' ');

        if (splitedUptime[0] === '0' && splitedUptime[2] === '03' && splitedUptime[4] === '00') {
            client.say(client.channel, 'Всем привет, я пришел! :)');
            telegram.notification(game);
            discord.noftification(game);
        }
    }
}, _.convertTime(seconds=1));

/* FUNCTIONS */

function userClass(username, id) {
    for (let i in arrays.users) {
        if (username === arrays.users[i].username) return arrays.users[i];
    }

    return new user(username, id);
}

function followerAge(user) {
    const userID = user.id;
    const username = user.username;

    const banList = ['anna_scorpion05'];

    try {
        client.api({
            url: `https://api.twitch.tv/kraken/users/${userID}/follows/channels/158466757`,
            method: "GET",
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
            }
        }, (err, res, body) => {
            if (body.message && body.message === 'Follow not found') {
                client.say(client.channel, `@${username}, а ты зафоловлен(а)?`);
                return;
            }
            let now = new Date();
            let then = body.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов, mm минут и ss секунд");

            if (banList.includes(username)) {
                if (user.counters.followerAge > 2) {
                    client.say(client.channel, `@${username}, я усталь. Можна отдохнуть?`);
                } else {
                    const int = _.randomInt(0,1)
                    if (int === 0) client.say(client.channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`);
                    else client.say(client.channel, `@${username}, вижу что ты зафоловлена. По времени норм, поверишь?`);
                }
            } else client.say(client.channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`)

            user.counters.followerAge++;
        })
    } catch {}
}

function watchTime(user) {
    const userID = user.id;
    const username = user.username;

    const banList = ['anna_scorpion05'];

    try {
        client.api({
            url: `https://api.twitch.tv/kraken/streams/158466757`,
            method: "GET",
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
            }
        }, (err, res, body) => {
            console.log(body);

            let now = new Date();
            let then = body.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов, mm минут и ss секунд");
        })
    } catch {}
}

function getUptime() {
    if (uptime == undefined) client.say(client.channel, `Стример сейчас оффлайн`);
    else client.say(client.channel, `Стример ведет трансляцию уже ${uptime}!`)
}

function hiMessage(channel, message, username) {
    if (timers.hi == null || timers.hi === 0) {
        const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
        const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!', 'а я тебя ждал!'];

        if (_.checkString(message, '@')) return false;
        if (_.checkString(message.toLowerCase(), 'передай')) return false;
        if (arrays.hi.includes(username)) return false;

        for (let i in hi) {
            if (_.checkString(message.toLowerCase(), hi[i]) === true) {
                client.say(channel, `@${username}, ${_.randomElementFromArray(hello)} ShowOfHands`);
                arrays.hi.push(username);
                timers.hi = 1;
                const func = () => timers.hi = 0;
                setTimeout(func, _.convertTime(seconds = 2));
                return true;
            }
        }
    }

    return false;
}

function boyfriend(channel, message, username) {
    const boy = ['парень кати'];

    for (let i in boy) {
        if (message.includes(boy[i]) === true) {
            client.say(channel, `@${username}, ну елки-палки. Он не парень Кати, он Джулай!`);
            return true;
        }
    }

    return false;
}

function question(user, message) {
    const channel = client.channel;
    const username = user.username;

    const allowList = ['jourloy'];
    const banList = ['anna_scorpion05'];

    if (allowList.includes(username) === true) {
        const array = ['Я не могу ответить на этот вопрос'];
        if (user.timers.ask === 0 && message.includes('?') && message.length > 6) {
            client.say(channel, `@${username} -сан, ${_.randomElementFromArray(array)}`);
            user.timers.ask = 1;
            const func = () => user.timers.ask = 0;
            setTimeout(func, _.convertTime(seconds=10));
        }
    } else if (banList.includes(username) === true) return
    else {
        const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
        if (user.timers.ask === 0 && message.includes('?') && message.length > 6) {
            client.say(channel, `@${username}, ${_.randomElementFromArray(array)}`);
            user.timers.ask = 1;
            const func = () => user.timers.ask = 0;
            setTimeout(func, _.convertTime(seconds=20));
        }
    }
}

function bigBrain(username) {
    const channel = client.channel;
    const array = ['Не будешь врагом и будешь другом тогда', 'Самураев-сенсеев много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь'];

    if (timers.bigBrain == 0) {
        client.say(channel, `@${username}, как говорил самурай-сенсей, "${_.randomElementFromArray(array)}"`);
        timers.bigBrain = 1;
        const func = () => timers.bigBrain = 0;
        setTimeout(func, _.convertTime(minutes = 2));
    }
}

function roulette(user) {
    const channel = client.channel;
    const username = user.username;

    const allowList = ['jourloy', 'kartinka_katerinka'];
    const banList = ['anna_scorpion05'];

    if (allowList.includes(username) === true) {
        const bullet = _.randomInt(1, 4);
        const hole = _.randomInt(1, 4);

        if (user.timers.roulette == 0) {
            if (bullet === hole) client.say(channel, `@${username} -сан, пуля должна была попасть в вас, но я подставился и вы в безопасности`);
            else client.say(channel, `@${username} -сан, удача пока что на вашей стороне`)

            user.timers.roulette = 1;
            const setQuestionTime = () => user.timers.roulette = 0;
            setTimeout(setQuestionTime, _.convertTime(seconds = 10));
        }
    } else if (banList.includes(username) === true) return;
    else {
        const bullet = _.randomInt(1, 12);
        const hole = _.randomInt(1, 12);

        if (user.timers.roulette == 0) {
            if (bullet === hole) {
                client.say(channel, `@${username}, БАХ! Ты проиграл(а), хаха Kappa`);
                twitch.timeout(username, 2);
            }
            else client.say(channel, `@${username}, удача пока что на твоей стороне`)

            user.timers.roulette = 1;
            const setQuestionTime = () => user.timers.roulette = 0;
            setTimeout(setQuestionTime, _.convertTime(seconds = 30));
        }
    }
}

/* REACTIONS */

client.on("raided", (channel, username, viewers) => {
    client.action(channel, `==> Огромное спасибо ${username} за то, что зарейдил, а также отдельное спасибо всем ${viewers} зрителям за то, что присоединились к рейду!`);
});

client.on("clearchat", (channel) => {
    client.say(channel, 'Я первый Kappa');
});

client.on('action', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['display-name'].toLowerCase();
    if (twitch.isMod(channel, userstate) == true) return;

    twitch.timeout(username, _.convertTime(seconds = 10));
    console.log(`Bot => Twitch => Timeout => ${username} (10 seconds)`);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const id = userstate['user-id'];

    const user = userClass(username, id);

    if (_twitch.checkMessage(message) === true) {
        if (twitch.isMod(userstate) === true) {
            client.say(channel, `@${username}, ну зачееееем? BibleThump BibleThump`)
        } else {
            client.timeout(client.channel, username, 20);
        }
        console.log(`Bot => Twitch => Timeout => ${username}`);
    }

    if (boyfriend(channel, message, username) === true) return;
    if (hiMessage(channel, message, username) === true) return;

    const messageSplit = message.split(' ');

    switch(messageSplit[0]) {
        case '!q':
            question(user, message);
            break;

        case '!пк':
        case '!pc':
            if (viewers > 100) {
                if (timers.pc == 0 && message.includes('?') && message.length > 6) {
                    client.action(channel, `==> Ryzen 5 5500x | MSI RX 580 Armor | 16 GB RAM | Микрофон Razer Siren X`);
                    timers.pc = 1;
                    const setQuestionTime = () => timers.pc = 0;
                    setTimeout(setQuestionTime, _.convertTime(seconds = 5));
                }
            } else client.action(channel, `==> Ryzen 5 5500x | MSI RX 580 Armor | 16 GB RAM | Микрофон Razer Siren X`);
            break;

        case '!telegram':
        case '!tg':
            client.action(channel, '==> У этого телеграм бота вы можете подключить персональные уведомления: @JOURLAY');
            break;

        case '!ютуб':
        case '!youtube':
        case '!yt':
            client.action(channel, '==> Здесь вы можете посмотреть нарезки со стримов: youtube.com/channel/UCpHyajrQHc29BHUYV1DwXvA');
            break;

        case '!ds':
        case '!dis':
        case '!discord':
            client.action(channel, '==> На этом дискорд сервере можно получить анонсы о новом стриме или видео, а также поболотать в текстовом канале: discord.gg/zCATPVRp6p');
            break;

        case '!uptime':
        case '!up':
            getUptime();
            break;

        case '!followerage':
            followerAge(user);
            break;
        
        case '!bigbrain':
            bigBrain(username);
            break;

        case '!roulette':
            roulette(user, channel);
            break;

        case '!test_api':
            break;
    }
})

/* TELEGRAM */

tg.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text.toLowerCase();

    if (chatId == 466761645) {
        if (message == '/nf') telegram.notification();
        if (message == 'ping') tg.sendMessage(chatId, 'pong');
    }
});