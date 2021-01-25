const { ChatDefence } = require('./Utils/ChatDefence');
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
            raid: 0,
        }
        this.counters = {
            followerAge: 0,
            roulette: 0,
            message: 0,
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
        if (body == null || body.stream == null) uptime = null;
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

        if (splitedUptime[0] === '0' && splitedUptime[2] === '05' && splitedUptime[4] === '00') {
            client.say(client.channel, 'Всем привет, я пришел! :)');
            setTimeout(emoute, _.convertTime(null, 30));
            discord.noftification(game);
        }

        if (streamLive === 0) {
            if (splitedUptime[0] === '0' && splitedUptime[2] === '00' && splitedUptime[4] === '00') return;
            streamLive = 1;
            const spyStream = 1;
            if (spyStream === 1 && spy.bool === false) {
                spy.bool = true;
                const spyCome = () => {
                    spy.was = true;
                    const names = ['Иван', 'Петр', 'Мария', 'Шпион', 'Джулай', 'Самурай', 'Наруто', 'Фолловер', 'Зритель', 'Глеб', 'НеШпион', 'Ютубер', 'Ансаб', 'Картинка', 'Язашифровался'];

                    spy.name = names[_.randomInt(0, names.length-1)]
                    const name = caesarCipher(spy.name);

                    client.say(client.channel, `Чат, у нас проблема, к нам проник`);
                    client.color("Red");
                    client.action(client.channel, `ШПИОН`);
                    client.color("BlueViolet");
                    client.say(client.channel, `Если вы не найдете его, то он доберется до нас`);
                    client.say(client.channel, `Чтобы найти его вам необходимо узнать его имя, но он зашифровался и нам известно только то, что он очень любит салат Цезарь и это:`);
                    client.color("Green");
                    client.action(client.channel, name);
                    client.color("BlueViolet");
                    client.say(client.channel, `Давайте, юные и не только самураи, не подведите своего даймё!`);

                    const banChat = () => {
                        if (spy.found === false) {
                            client.emoteonly(client.channel);
                            client.say(client.channel, 'Чаааааат... Мы... Не... Смогли...');
                            spy.found = true;
                            const unbanChat = () => {
                                client.emoteonlyoff(client.channel);
                            }
                            setTimeout(unbanChat, _.convertTime(seconds = 30));
                        }
                    }
                    setTimeout(banChat, _.convertTime(null, _.randomInt(2, 5)));
                }
                setTimeout(spyCome, _.convertTime(null, _.randomInt(10, 20)));
            }
            const reset = () => streamLive = 0;
            setTimeout(reset, _.convertTime(hours = 5));
        }
    }
}, _.convertTime(seconds=1));

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

/* REACTIONS */
client.on("cheer", (channel, userstate, message) => {
    const bits = userstate.bits;
    if (bits <= 100) client.action(channel, `==> Спасибо за ${bits}, @${username}. Мне приятно`);
    if (bits > 100 && bits <= 500) client.action(channel, `==> Воу, @${username}, спасибо за щедрость, мне приятно`);
    if (bits > 500 && bits <= 1000) client.action(channel, `==> ОМГ, сегодня не день, сегодня счастье. Спасибо за ${bits}, @${username}`);
    if (bits > 1000 && bits <= 2000) client.action(channel, `==> Благодаря @${username} я, кажется, сейчас выключу стрим и пойду переезжать`);
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
    if (twitch.isMod(channel, userstate) == true) return;

    twitch.timeout(username, _.convertTime(seconds = 10));
    console.log(`Bot => Twitch => Timeout => ${username} (10 seconds)`);
})

client.on('redeem', (channel, username, rewardType, tags) => {
    if (rewardType === '6aa74658-1b0a-49ed-8bc2-2ff0de3f6cef') {
        Coins.plusCoins(username, 10);
        client.say(channel, `@${username}, отлично, я перевел 10 осколков душ на ваш счет. Проверить кошелек можно командой !wallet. Спасибо, что используете ДжапанБанк`);
    }
});

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const id = userstate['user-id'];

    const user = userClass(username, id, userstate);
    Coins.plusCoins(username, 0.1);

    if (ChatDefence.run(user, message, userstate) === false) return;

    if (spy.bool === true && spy.was === true && spy.found === false) {
        if (message === spy.name.toLowerCase()) {
            spy.found = true;
            client.color("Green");
            client.action(client.channel, `ПОЗДРАВЛЯЮ`);
            client.color("BlueViolet");
            client.say(client.channel, `${username}, спас всех нас. Мы нашли этого шпиона и посадили в тюрьму. Отдыхаем, юные и не только самураи`);
            return;
        }
    }

    if (boyfriend(channel, message, username) === true) return;
    if (hiMessage(channel, message, username) === true) return;

    const messageSplit = message.split(' ');

    switch(messageSplit[0]) {
        case '!help':
            Help.run(message);
            break;
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
        
        case '!emoute':
            emoute();
            break;
        
        case '!ping':
            if (twitch.isMod(userstate) === true) client.action(channel, '==> pong');
            break;
        
        case '!stop':
            if (twitch.isMod(userstate) === false) return;
            throw 'Exit';
        
        case '!ban':
            if (twitch.isMod(userstate) === false) return;
            break;

        case '!register':
            if (Coins.addUser(username) === true) client.say(channel, `@${username}, спасибо что выбрали ДжапанБанк! С нами ваши осколки душ в безопасности!`);
            break;

        case '!wallet':
            client.say(channel, `@${username}, у вас на счету ${Coins.getAmount(username).coins} осколков душ. Спасибо, что используете ДжапанБанк`);
            break;

        case '!raid':
            const coins = Coins.getAmount(username).coins;
            if (coins >= 1 && user.timers.raid === 0) {
                user.timers.raid = 1;
                let time = _.randomInt(25, 180);
                client.say(channel, `@${username}, ты отправляешься в рейд на территорию запрета. За проход ты отдал(а) 5 осколоков души. Если вернешься живым - получишь их обратно. Время рейда около ${time} минут.`);
                Coins.minusCoins(username, 5);
                const fail = _.randomInt(0, 2);
                if (fail === 2) time = Math.round(time / 2);
                const func = () => {
                    if (fail === 2) {
                        const back = _.randomInt(120, 230);
                        client.say(channel, `@${username}, тебя сильно раниили в рейде. Возвращение займет ${back} минут`);
                        const restFunc = () => user.timers.raid = 0;
                        setTimeout(restFunc, _.convertTime(back));
                    } else {
                        const rand = _.randomInt(0, 3);
                        if (rand < 3) {
                            const find = _.randomInt(1, 4);
                            const rest = _.randomInt(40, 60);
                            client.say(channel, `@${username}, рейд окончен. Тебе вернули 5 осколоков, а также в рейде было найдено ${find} осколков души. Отдых займет около ${rest} минут`);
                            Coins.plusCoins(username, find+5);
                            const restFunc = () => user.timers.raid = 0;
                            setTimeout(restFunc, _.convertTime(rest));
                        } else {
                            const find = _.randomInt(1, 2);
                            const rest = _.randomInt(70, 100);
                            Coins.plusCoins(username, find+5);
                            client.say(channel, `@${username}, рейд окончен. Тебе вернули 1 осколок, а также в рейде было найдено ${find} осколков души. Рейд был тяжелым, так что отдых займет около ${rest} минут`);
                            const restFunc = () => user.timers.raid = 0;
                            setTimeout(restFunc, _.convertTime(rest));
                        }
                    }
                }
                setTimeout(func, _.convertTime(time));
            }

        case '!stock':
            break;
    }
})