/* IMPORTS */
const { client } = require('./Bots/Jourloy_bot');
const { admin } = require('./Bots/Jourloy');

const { Game } = require('../Game/Game');
const { ChatDefence } = require('../Utils/ChatDefence');
const { Database } = require('../Utils/Database');
const { tools, errors } = require('../Utils/Tools');

/* PARAMS */
let uptime = undefined;
let viewers = 0;
let maxViewers = 0;
let game = undefined;
let gameHistory = [];

/* FUNCTIONS */

/* INTERVALS */
setInterval(function () {
    if (uptime != null && game != null) {
        const splitedUptime = uptime.split(' ');
        if (splitedUptime[0] === '0' && splitedUptime[2] === '2' && splitedUptime[4] === '00') discord.noftification(game);
    }
}, tools.convertTime({seconds: 1}));

setInterval(function () {
    const send = Game.send();

    for (let i in send) {
        client.say(client.channel, send[i].message);
        delete send[i];
        return;
    }
}, tools.convertTime({seconds: 5}))

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
}, tools.convertTime({seconds: 1}));

/* CLASSES */

class commands {
    static question(information) {
        const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];

        const allowList = [''];
        const banList = ['anna_scorpion05'];

        const username = information.username;
        const message = information.message;
        const timers = information.timers;
        const channel = information.channel;
        
        if (allowList.includes(username) === true || banList.includes(username) === true) return;
        else {
            if (timers.ask === 0 && message.includes('?') && message.length > 6) {
                client.say(channel, `@${username}, ${tools.randomElementFromArray(array)}`);
                timers.ask = 1;
                Database.update.timers(username, timers);
                setTimeout(function() {
                    timers.ask = 0;
                    Database.update.timers(username, timers);
                }, tools.convertTime({seconds: 20}));
            }
        }
    }

    static uptime(information) {
        const channel = information.channel;

        if (uptime == undefined) client.say(channel, `Стример сейчас оффлайн`);
        else {
            let message = `Стример ведет трансляцию уже ${uptime} | Игры на стриме: `
            for (let i in gameHistory) {
                if (i == 1) message += gameHistory[i];
                else message += ` -> ${gameHistory[i]}`;
            }
            client.say(channel, message);
        }
    }

    static followerAge(information) {
        const username = information.username;
        const id = information.id;
        const timers = information.timers;
        const channel = information.channel;

        try {
            client.api({
                url: `https://api.twitch.tv/kraken/users/${id}/follows/channels/158466757`,
                method: "GET",
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                    'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
                }
            }, (err, res, body) => {
                if (body.message && body.message === 'Follow not found') {
                    client.say(channel, `@${username}, а ты зафоловлен(а)?`);
                    return;
                }
                let now = new Date();
                let then = body.created_at;
                let ms = moment(now).diff(moment(then));
                let d = moment.duration(ms);
                const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов, mm минут и ss секунд");
                client.say(channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`)
                timers.followerAge = 1;
                Database.update.timers(timers);
    
                setTimeout(function() {
                    const userTimers = Database.get.timers(username);
                    userTimers.followerAge = 0;
                    Database.update.timers(username, userTimers);
                }, tools.convertTime({hours: 4}));
            })
        } catch (e) {}
    }

    static bigBrain(information) {
        const username = information.username;
        const channel = information.channel;
        const timers = information.timers;
        const array = ['Не будешь врагом и будешь другом тогда', 'Даймё много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь', 'Опоздал на стрим - йены не получил',
        'Не трать йены просто так, трать йены на награды', 'Кто сражается и следует за даймё, тот получает 250 йен', 'Победил - молодец, проиграл - jourloPressF', 'На каждое отверстие есть болт и хитрая гайка... А пробка - вещь неуничтожимая... Как легендарная набедренная повязка огра...', 'Да я и не спорю... С катаной в моих руках со мной почему-то никто не спорит...'];

        if (timers.bigBrain === 0) {
            client.say(channel, `@${username}, как говорил даймё, "${toolsrandomElementFromArray(array)}"`);
            timers.bigBrain = 1;
            const func = () => timers.bigBrain = 0;
            setTimeout(func, tools.convertTime({minutes: 2}));
        }
    }
}

/* REACTION */
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

client.on('action', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    if (userstate.mod === true || username === 'jourloy' || username === 'kartinka_katerinka') return;

    client.timeout(username, tools.convertTime({seconds: 10}));
    console.log(`Twitch => Timeout => ${username} (10 seconds)`);
});

client.on('clearchat', (channel) => {
    client.say(channel, `Я первый Kappa`);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');

    const user = Database.get.user_jr(username);
    if (user === errors.ERR_NOT_FIND_USER) Database.add.user_jr(username);
    if (ChatDefence.run(username, message, userstate, client) === false) return;
    Database.add.messages(username)

    const information = {
        username: username,
        id: userstate['user-id'],
        userstate: userstate,
        message: message,
        splited: message.split(' '),
        timers: Database.get.timers,
        channel: channel,
    }
    if (messageSplit[0] === '!q') {
        commands.question(information);
    } else if (messageSplit[0] === '!пк' || messageSplit[0] === '!pc') {
        client.action(channel, `==> Ryzen 5 5500x | MSI RX 580 Armor | 16 GB RAM | Микрофон Razer Siren X`);
    } else if (messageSplit[0] === '!yt') {
        client.action(channel, '==> Здесь вы можете посмотреть нарезки со стримов: youtube.com/channel/UCpHyajrQHc29BHUYV1DwXvA');
    } else if (messageSplit[0] === '!ds') {
        client.action(channel, '==> На этом дискорд сервере можно получить анонсы о новом стриме или видео, а также поболотать в текстовом канале: discord.gg/zCATPVRp6p');
    } else if (messageSplit[0] === '!uptime') {
        commands.uptime(information);
    } else if (messageSplit[0] === '!followerage') {
        commands.followerAge(information);
    } else if (messageSplit[0] === '!bigbrain') {
        commands.bigBrain(information);
    } else if (messageSplit[0] === '!ping') {
        if (username === 'jourloy') client.action(channel, '==> pong');
    } else if (messageSplit[0] === '!vip') {
        if (username === 'katinka_katerinka') admin.vip(channel, username);
    } else if (messageSplit[0] === '!mod') {
        if (username === 'katinka_katerinka') admin.mod(channel, username);
    } else if (messageSplit[0] === '!raid') {

        const result = Game.toRaid(username, client);
        if (result === errors.ERR_NOT_FIND_USER) client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else if (result === errors.ERR_USER_NOT_IN_FRACTION) client.say(channel, `@JOURLOY, у пользователя [${username}] ошибка с данными (fraction error)`);
        else if (result === errors.ERR_ALREADY_IN_RAID) client.say(channel, `@${username}, вы уже в рейде. Проверить время до возвращения можно командой !status`);
        else if (result === errors.ERR_NOT_ENOUGH_SHARDS) client.say(channel, `@${username}, у вас не достаточно осколов для похода в рейд`);

    } else if (messageSplit[0] === '!fraction') {

        const game = Database.get.game(username);
        if (game === errors.ERR_NOT_FIND_USER || game.fraction === '') {
            if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) client.say(channel, `@${username}, после !fraction необходимо указать букву фракции`);
            else if (messageSplit[1] === 'V') {
                client.say(channel, `@${username}, хорош боец, нам как раз такие нужны! У нас все просто, видишь добро - забираешь, я думаю ты быстро освоишься. Захочешь отправиться за добычей - пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'C') {
                client.say(channel, `@${username}, смирно! Теперь это твой новый дом. У нас много боевых задач, как будешь готов - пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'J') {
                client.say(channel, `@${username} добро пожаловать. Отныне ты - самурай. Оберегай катану, как жену, и используй вакидзаси, как перо. Как будешь готов отправиться в путешествие, пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'K' && username === 'jourloy') {
                Jourloy.action(channel, `==> @${username}, теперь ты не просто человек. Теперь ты имеешь преимущество над другими. Ты представляешь особый класс. Отныне ты - мастер душ. Как будешь готов к новым приключениям, пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            }
        } else {
            if (game.fraction === 'C') client.say(client.channel, `@${username}, вашей фракцией является: Боевая группа "Цезарь" `);
            else if (game.fraction === 'V') client.say(client.channel, `@${username}, вашей фракцией является: Викинги`);
            else if (game.fraction === 'J') client.say(client.channel, `@${username}, вашей фракцией является: Клан самураев "Сакура"`);
            else if (game.fraction === 'K') client.say(client.channel, `@${username}, вашей фракцией является: Мастера душ`);
        }

    } else if (messageSplit[0] === '!wallet') {

        const raid = Database.get.raid(username);
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (raid.inRaid === true) {
            client.say(channel, `@${username}, вы сейчас в рейде. Данное действие невозможно`)
        }
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else {
            if (game.fraction === 'C') client.say(channel, `@${username}, на вашем счету ${hero.wallet} купюр`);
            else if (game.fraction === 'V') client.say(channel, `@${username}, на вашем счету ${hero.wallet} золотых монет`);
            else if (game.fraction === 'J') client.say(channel, `@${username}, на вашем счету ${hero.wallet} слитков Великой стали`);
            else if (game.fraction === 'K') client.say(channel, `@${username}, на вашем счету ${hero.wallet} осколков душ`);

        }
    } else if (messageSplit[0] === '!xp') {

        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else client.say(channel, `@${username}, у вас ${hero.level} уровень и ${hero.xp} очков опыта`);

    } else if (messageSplit[0] === '!hp') {

        if (username !== 'jourloy') return;
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else client.say(channel, `@${username}, у вас ${hero.hp} очков здоровья`);

    } else if (messageSplit[0] === '!status') {

        const raid = Database.get.raid(username);
        if (raid.inRaid === true) {
            const now = Math.floor(moment.now() / 1000);
            const created_at = raid.raid.created;
            const time = raid.raid.time;

            let about = Math.floor((created_at + time) - now);
            let hours = Math.floor(about/60/60);
            let minutes = Math.floor(about/60)-(hours*60);
            let seconds = about%60

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            client.say(channel, `@${username}, вы находитесь в рейде. До возвращения еще ${formatted}`);
        } else client.say(channel, `@${username}, вы готовы отправиться в запретные земли. Отправиться в рейд можно командой !raid`);

    }
});

/* EXPORTS */