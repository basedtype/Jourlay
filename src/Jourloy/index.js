const { _, _twitch } = require('./tools');
const { client, twitch } = require('./twitch');
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
}
const followers = [];

/* INTERVALS */

setInterval(function () {
    if (viewers > 5) client.action(channel, '==> Вот ссылка на лучший телеграм канал, где можно узнать о всех новостях связанных со стримами: t.me/JourloyTwitch');
}, _.convertTime(minutes = 30));

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
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин.");
        }
    })
}, _.convertTime(seconds=1));

setInterval(function() {
    client.api({
        url: `https://api.twitch.tv/kraken/channels/158466757/follows`,
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        const newFollower = [];
        if (body && body.followers) {
            for (i in body.follows) newFollower.push(body.follows[i].user.display_name);
            if (followers.length == 0) followers = newFollower;
            else {
                for (i in newFollower) {
                    if (!followers.includes(newFollower[i])) {
                        twitch.say(`@${newFollower[i]}, огромное спасибо тебе за фоллоу!`);
                        followers = newFollower;
                    }
                }
            }
        }
    });
}, _.convertTime(seconds=10));

/* FUNCTIONS*/

function followerAge(userstate) {
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
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов и mm минут");

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
            twitchInfo.commands++;
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

client.on('chat', (channel, userstate, message, self) => {
    const username = userstate['display-name'].toLowerCase();
})

client.on('action', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['display-name'].toLowerCase();
    if (twitch.isMod(channel, userstate) == true) return;

    twitch.timeout(username, _.convertTime(seconds = 20));
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();

    if (hiMessage(channel, message, username) === true) return;

    const messageSplit = message.split(' ');
    if (_twitch.checkMessage(username, message) === true) return;

    switch(messageSplit[0]) {
        case '!help':
            client.action(channel, '==> !up - сколько идет трансляция | !pc - про комп | !tg - ссылка на телеграм| !q - задать вопрос боту | !followerage - сколько ты зафоловлен(а) на меня');
            break;

        case '!q':
            question(username, message);
            break;

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
            client.action(channel, '==> Вот ссылка на лучший телеграм канал, где можно узнать о всех новостях связанных со стримами: t.me/JourloyTwitch');
            break

        case '!up':
        case '!uptime':
            getUptime();
            break;

        case '!followerage':
            followerAge(channel, userstate);
            break;

    }
})