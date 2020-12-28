const { client, twitch } = require('../modules/twitch');
const { telegram } = require('../modules/telegram');
const { _, _twitch } = require('../tools');
const moment = require('moment');

/* PARAMS */

let uptime = undefined;
let viewers = 0;
let maxViewers = 0;

const arrays = {
    hi: []
}
const timers = {
    hi: 0,
    ask: 0,
    pc: 0,
    socAD: 0,
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
        if (body != null && body.stream != null) {
            viewers = body.stream.viewers;
            if (viewers > maxViewers) maxViewers = viewers;

            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин. ss сек.");
        }
    })
}, _.convertTime(seconds=1));

setInterval(function () {
    if (timers.socAD === 0) {
        if (viewers >= 5) {
            client.action(client.channel, '==> У этого телеграм бота вы можете подключить персональные уведомления: @JOURLAY');
            timers.socAD = 1;
            const func = () => timers.socAD = 0;
            setTimeout(func, _.convertTime(seconds=(60*30)));
        }
    }
}, _.convertTime(seconds=1));

setInterval(function () {
    if (uptime != undefined) {
        const splitedUptime = uptime.split(' ');

        if (splitedUptime[0] === '0' && splitedUptime[2] === '03' && splitedUptime[4] === '30') {
            client.say(client.channel, 'Всем привет, я пришел! :)');
            telegram.notification();
        }
    }
}, _.convertTime(seconds=1));

/* FUNCTIONS */

function followerAge(channel, userstate) {
    const userID = userstate['user-id'];
    const username = userstate['display-name'].toLowerCase();

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
            let now = new Date();
            let then = body.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов, mm минут и ss секунд");

            client.say(client.channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`)
        })
    } catch {}
}

function getUptime() {
    if (uptime == undefined) client.say(client.channel, `Стример сейчас оффлайн`);
    else client.say(client.channel, `Стример ведет трансляцию уже ${uptime}!`)
}

function hiMessage(message, username) {
    const channel = client.channel;

    if (timers.hi == null || timers.hi === 0) {
        const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
        const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!', 'а я тебя ждал!'];

        if (_.checkString(message, '@')) return false;
        if (_.checkString(message.toLowerCase(), 'передай')) return false;
        if (arrays.hi.includes(username)) return false;

        for (let i in hi) {
            if (_.checkString(message.toLowerCase(), hi[i]) === true) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(hello)} ShowOfHands`);
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

function question(username, message, length = 20) {
    const channel = client.channel;
    const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
    if (viewers < 1200) {
        if (timers.ask == null || timers.ask === 0 && message.includes('?') && message.length > 6) {
            client.say(channel, `@${username}, ${_.randomElementFromArray(array)}`);
            timers.ask = 1;
            const func = () => timers.ask = 0;
            setTimeout(func, _.convertTime(seconds=length));
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

    if (_twitch.checkMessage(message) === true) {
        client.ban(client.channel, username, '[ JOURLAY ]')
        console.log(`Bot => Twitch => Ban => ${username}`);
    }

    if (hiMessage(channel, message, username) === true) return;

    const messageSplit = message.split(' ');

    switch(messageSplit[0]) {
        case '!help':
            client.action(channel, '==> !up - сколько идет трансляция | !pc - про комп | !tg - ссылка на бота | !q - задать вопрос боту | !followerage - сколько ты зафоловлен(а) на меня');
            break;

        case '!q':
            question(username, message);
            break;

        case '!пк':
        case '!pc':
            if (viewers > 100) {
                if (timers[channel].pc == 0 && message.includes('?') && message.length > 6) {
                    client.action(channel, `==> Ryzen 5 5500x | MSI RX 580 Armor | 16 GB RAM`);
                    timers[channel].pc = 1;
                    const setQuestionTime = () => timers[channel].pc = 0;
                    setTimeout(setQuestionTime, _.convertTime(seconds = 5));
                }
            } else client.action(channel, `==> Ryzen 5 5500x | MSI RX 580 Armor | 16 GB RAM`);
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

        case '!uptime':
        case '!up':
            getUptime();
            break;

        case '!followerage':
            followerAge(channel, userstate);
            break;
    }
})