const { ChatDefence } = require('./Utils/ChatDefence');
const { Database } = require('./Utils/Database');
const { Coins } = require('./Utils/Coins');

const { client, twitch } = require('./modules/twitch');
const { discord, ds } = require('./modules/discord');
const { _, _twitch } = require('./tools');
const moment = require('moment');
const { JsonDB } = require('node-json-db');
const { duration } = require('moment');

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
    emoji: 0,
}

let streamLive = 0;
let spy = {
    bool: false,
    was: false,
    found: false,
    name: null,
    banChat: false,
}

/* CLASS */

class user {
    constructor(username, id, userstate) {
        this.username = username;
        this.userstate = userstate;
        this.id = id;
        this.timers = {
            ask: 0,
            pc: 0,
            socAD: 0,
            bigBrain: 0,
            roulette: 0,
            resetMessage: 0,
        }
        this.counters = {
            followerAge: 0,
            roulette: 0,
            message: 0,
        }
        this.raid = {
            bool: false,
            created_at: null,
            fail: false,
            invMax: 3,
        }

        arrays.users.push(this);
    }
}

/* INTERVALS */

setInterval(function() {
    if (viewers > 15) emoute();
}, 1000);

/* FUNCTIONS */

function emoute() {
    if (timers.emoji === 0) {
        client.action(client.channel, '==> KEKW EZ для тебя просто текст? Чтобы видеть больше смайлов, необходимо установить расширение https://frankerfacez.com, а затем перейти в настройки расширения --> Аддоны --> Включить там аддон BetterTTV.');
        timers.emoji = 1;
        const set = () => timers.emoji = 0;
        setTimeout(set, _.convertTime(null, 30));
    }
}

function caesarCipher(str){  
    const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЪЫЭЮЯ'.toLowerCase();
    let newStr = '';
    const int = _.randomInt(1, 7);

    for (let i in str) {
        const index = alphabet.indexOf(str[i].toLowerCase());
        let step = index + int;
        if (step > alphabet.length - 1) {
            step = step - alphabet.length - 1;
        }
        newStr += alphabet[step];
    }

    return newStr;
}
  

function userClass(username, id, userstate) {
    for (let i in arrays.users) {
        if (username === arrays.users[i].username) return arrays.users[i];
    }

    return new user(username, id, userstate);
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
                    else client.say(client.channel, `@${username}, вижу что ты зафоловлен(а). По времени норм, поверишь?`);
                }
            } else client.say(client.channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`)

            user.counters.followerAge++;
        })
    } catch (e) {}
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
    const array = ['Не будешь врагом и будешь другом тогда', 'Даймё много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь', 'Опоздал на стрим - йены не получил',
    'Не трать йены просто так, трать йены на награды', 'Кто сражается и следует за даймё, тот получает 250 йен', 'Победил - молодец, проиграл - jourloPressF', 'На каждое отверстие есть болт и хитрая гайка... А пробка - вещь неуничтожимая... Как легендарная набедренная повязка огра...', 'Да я и не спорю... С катаной в моих руках со мной почему-то никто не спорит...'];

    if (timers.bigBrain == 0) {
        client.say(channel, `@${username}, как говорил даймё, "${_.randomElementFromArray(array)}"`);
        timers.bigBrain = 1;
        const func = () => timers.bigBrain = 0;
        setTimeout(func, _.convertTime(null, 2));
    }
}

function roulette(user) {
    const channel = client.channel;
    const username = user.username;

    const answer = ['удача пока на твоей стороне', 'удача пока на твоей стороне, но это пока', 'пистолет выстрелил, но я случайно дернул рукой и мы разбили люстру', 'БАХ! А нет, не бах, пистолет не могу найти'];
    const botAnswer = _.randomElementFromArray(answer);

    const allowList = ['jourloy', 'kartinka_katerinka'];
    const banList = ['anna_scorpion05'];

    if (allowList.includes(username) === true) {
        const bullet = _.randomInt(1, 4);
        const hole = _.randomInt(1, 4);

        if (user.timers.roulette == 0) {
            if (bullet === hole) client.say(channel, `@${username} -сан, пуля должна была попасть в вас, но я подставился и вы в безопасности`);
            else client.say(channel, `@${username} -сан, ${botAnswer}`)

            user.timers.roulette = 1;
            const setQuestionTime = () => user.timers.roulette = 0;
            setTimeout(setQuestionTime, _.convertTime(seconds = 10));
            user.counters.roulette++;
        }
    } else if (banList.includes(username) === true) {
        const bullet = _.randomInt(1, 15);
        const hole = _.randomInt(1, 15);

        if (user.timers.roulette == 0) {
            if (bullet === hole) {
                client.say(channel, `@${username}, БАХ! Ты проиграл(а), хаха Kappa`);
                client.timeout(channel, username, user.counters.roulette * 5 + 40, 'Пуля не промахнулась');
                user.counters.roulette = -1;
            }
            else client.say(channel, `@${username}, ${botAnswer}`);

            user.timers.roulette = 1;
            const setQuestionTime = () => user.timers.roulette = 0;
            setTimeout(setQuestionTime, _.convertTime(seconds = 30));
            user.counters.roulette++;
        }
    } else {
        const bullet = _.randomInt(1, 10);
        const hole = _.randomInt(1, 10);

        if (user.timers.roulette == 0) {
            if (bullet === hole) {
                client.say(channel, `@${username}, БАХ! Ты проиграл(а), хаха Kappa`);
                client.timeout(channel, username, user.counters.roulette * 5 + 20, 'Пуля не промахнулась');
                user.counters.roulette = -1;
            }
            else client.say(channel, `@${username}, ${botAnswer}`)

            user.timers.roulette = 1;
            const setQuestionTime = () => user.timers.roulette = 0;
            setTimeout(setQuestionTime, _.convertTime(seconds = 30));
            user.counters.roulette++;
        }
    }
}

class Help {
    static run(message) {
        const split = message.split(' ');

        if (split[1] === 'roulette') this.roulette();
        if (split[1] === 'ДжапанБанк') Coins.help(client);
        if (split[1] === 'send') client.action(client.channel, '==> !send | Этой командой можно отправить осколки душ другому человеку. Комиссия за перевод составляет 5%');
        return;
    }

    static roulette() {
        client.action(client.channel, '==> !roulette | Крутится пуля в барабане и производится выстрел из пистолета. Если пуля вылетела и попала в тебя, то ты отправляешься в таймаут, причем время таймаута неограниченно');
        return;
    }
}
