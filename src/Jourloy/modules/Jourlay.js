/* IMPORTS */
const tmi = require('tmi.js');
const moment = require('moment');
const { _ } = require('../tools');
const { ChatDefence } = require('../Utils/ChatDefence');
const { Database } = require('../Utils/Database');
const { Coins } = require('../Utils/Coins');

/* TWITCH SETTINGS */
const options = {
    options: {
        debug: false
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'jourlay',
        password: 'oauth:q88yx70ba1uclc74xhxxv0lw3at9h7'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
client.botName = options.identity.username;
client.lang = 'ru';
function onConnectedHandler() {
    client.color("BlueViolet");
    console.log('Jourlay => Twitch => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* PARAMS */
let uptime = undefined;
let viewers = 0;
let maxViewers = 0;
let game = undefined;
let gameHistory = [];

const timers = {
    hi: 0,
    ask: 0,
    pc: 0,
    socAD: 0,
    vote: 0,
    bigBrain: 0,
    emoji: 0,
}

/* FUNCTIONS */
function getUptime() {
    if (uptime == undefined) client.say(client.channel, `Стример сейчас оффлайн`);
    else {
        let message = `Стример ведет трансляцию уже ${uptime} | Игры на стриме: `
        for (let i in gameHistory) {
            if (i == 1) message += gameHistory[i];
            else message += ` => ${gameHistory[i]}`;
        }
        client.say(client.channel, message);
    }
}

function question(username, message) {
    const channel = client.channel;
    const timers = Database.getTimers(username);

    const allowList = ['jourloy'];
    const banList = ['anna_scorpion05'];

    if (allowList.includes(username) === true || banList.includes(username) === true) return;
    else {
        const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
        if (timers.ask === 0 && message.includes('?') && message.length > 6) {
            client.say(channel, `@${username}, ${_.randomElementFromArray(array)}`);
            timers.ask = 1;
            Database.updateTimers(username, timers);
            setTimeout(function() {
                timers.ask = 0;
                Database.updateTimers(username, timers);
            }, _.convertTime(seconds=20));
        }
    }
}

function bigBrain(username) {
    const channel = client.channel;
    const array = ['Не будешь врагом и будешь другом тогда', 'Даймё много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь', 'Опоздал на стрим - йены не получил',
    'Не трать йены просто так, трать йены на награды', 'Кто сражается и следует за даймё, тот получает 250 йен', 'Победил - молодец, проиграл - jourloPressF', 'На каждое отверстие есть болт и хитрая гайка... А пробка - вещь неуничтожимая... Как легендарная набедренная повязка огра...', 'Да я и не спорю... С катаной в моих руках со мной почему-то никто не спорит...'];
    if (timers.bigBrain == 0) {
        client.say(channel, `@${username}, как говорил даймё, "${_.randomElementFromArray(array)}"`);
        timers.bigBrain = 1;
        const func = () => timers.bigBrain = 0;
        setTimeout(func, _.convertTime(null, 2));
    }
}

function roulette(username) {
    const channel = client.channel;
    const timers = Database.getTimers(username);
    const counters = Database.getCounters(username);

    const answer = ['удача пока на твоей стороне', 'удача пока на твоей стороне, но это пока', 'пистолет выстрелил, но я случайно дернул рукой и мы разбили люстру', 'БАХ! А нет, не бах, пистолет не могу найти'];
    const botAnswer = _.randomElementFromArray(answer);

    const allowList = ['jourloy', 'kartinka_katerinka'];
    const banList = ['anna_scorpion05'];

    const bullet = _.randomInt(1, 10);
    const hole = _.randomInt(1, 10);
    if (timers.roulette == 0) {
        if (bullet === hole) {
            client.say(channel, `@${username}, БАХ! Ты проиграл(а), хаха Kappa`);
            client.timeout(channel, username, counters.roulette * 5 + 20, 'Пуля не промахнулась');
            console.log(`Jourlay => Twitch => Roulette => Timeout (${counters.roulette * 5 + 20}) => ${username}`);
            counters.roulette = -1;
        }
        else client.say(channel, `@${username}, ${botAnswer}`)

        timers.roulette = 1;
        Database.updateTimers(username, timers);
        setTimeout(function() {
            timers.roulette = 0
            Database.updateTimers(username, timers);
        }, _.convertTime(30));

        counters.roulette++;
        Database.updateCounters(username, counters);
    }
}

/* INTERVALS */
setInterval(function () {
    if (uptime != null && game != null) {
        const splitedUptime = uptime.split(' ');
        if (splitedUptime[0] === '0' && splitedUptime[2] === '2' && splitedUptime[4] === '00') discord.noftification(game);
    }
}, _.convertTime(seconds=1));

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
        if (body == null || body.stream == null) uptime = null;
        else if (body != null && body.stream != null) {
            viewers = body.stream.viewers;
            if (viewers > maxViewers) maxViewers = viewers;
            game = body.stream.game;
            if (gameHistory.includes(game) === false) gameHistory.push(game);

            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин. ss сек.");
        }
    })
}, _.convertTime(seconds=1));

/* REACTIONS */
client.on("cheer", (channel, userstate, message) => {
    const bits = userstate.bits;
    if (bits <= 100) client.action(channel, `==> Спасибо за ${bits}, @${username}. Мне приятно`);
    if (bits > 100 && bits <= 500) client.action(channel, `==> Воу, @${username}, спасибо за щедрость, мне приятно`);
    if (bits > 500 && bits <= 1000) client.action(channel, `==> ОМГ, сегодня не день, сегодня счастье. Спасибо за ${bits}, @${username}`);
    if (bits > 1000 && bits <= 2000) client.action(channel, `==> Благодаря @${username} я, кажется, сейчас выключу стрим и пойду кайфовать`);
    if (bits > 2000) client.action(channel, `==> @${username}, жесть ты шейх, спасибо тебе огромное. Перееду на днях в Дубаи, я думаю денег теперь мне хватит`);
});

client.on("timeout", (channel, username, reason, duration) => {
    if (duration >= 600) client.say(channel, `OMEGALUL => @${username}`);
});

client.on("raided", (channel, username, viewers) => {
    client.action(channel, `==> Огромное спасибо ${username} за то, что зарейдил, а также отдельное спасибо всем ${viewers} зрителям за то, что присоединились к рейду!`);
});

client.on("clearchat", (channel) => {
    client.say(channel, 'Я первый Kappa');
});

client.on('action', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['display-name'].toLowerCase();
    if (userstate.mod === true || username === 'jourloy') return;

    twitch.timeout(username, _.convertTime(seconds = 10));
    console.log(`Bot => Twitch => Timeout => ${username} (10 seconds)`);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');

    if (ChatDefence.run(username, message, userstate, client) === false) return;

    switch(messageSplit[0]) {
        case '!q':
            question(username, message);
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
            followerAge(username);
            break;
        
        case '!bigbrain':
            bigBrain(username);
            break;

        case '!roulette':
            roulette(username);
            break;
        
        case '!ping':
            if (username === 'jourloy') client.action(channel, '==> pong');
            break;
        
        case '!stop':
            if (username !== 'jourloy') return;
            throw 'Exit';
        
        case '!ban':
            if (username !== 'jourloy') return;
            break;

        case '!цель':
            client.say(channel, 'нашей целью в Satisfactory является строительство небесной платформы, на которой будут идти все процессы производства (а именно производство тяжелых модульных каркасов). На земле только добыча руды. Цель необходимо завершить до 28 февраля включительно, иначе будет отправлено 3 подарочные сабки');
            break;
    }
});