/* IMPORTS */
const { client } = require('./Bots/Jourloy_bot');
const { admin } = require('./Bots/Jourloy');

const { Game } = require('../Game/Game');
const { ChatDefence } = require('../Utils/ChatDefence');
const { Database } = require('../Utils/Database');
const { tools, errors } = require('../Utils/Tools');
const { discord } = require('./discord');
const moment = require('moment')

/* PARAMS */
let uptime = undefined;
let viewers = 0;
let maxViewers = 0;
let game = undefined;
let gameHistory = [];
let channelTimers = {
    repeat: 0,
}

const usersBan = ['anna_scorpion05'];

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
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" h. mm min. ss sec.");
        }
    })
}, tools.convertTime({seconds: 1}));

/* FUNCTIONS */
function test() {
    let result = true;
    try { require('./test') }
    catch { result = false }
    return result;
}

function question(information) {
    if (usersBan.includes(username) === true) return;
    const array = ['yes','no','maybe', '50%', 'I don\'t want answer','strage question','Maybe you will ask other question?','I don\'t know', 'I know, but I don\'t want answer', 'no, please, nooo'];
    const username = information.username;
    const message = information.message;
    const timers = information.timers;
    const channel = information.channel;

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

function getUptime(information) {
    const channel = information.channel;

    if (uptime == undefined) client.say(channel, `Streamer is offline now`);
    else {
        let message = `Stream uptime: ${uptime} | Games on stream: `
        for (let i in gameHistory) {
            if (i == 1) message += gameHistory[i];
            else message += ` -> ${gameHistory[i]}`;
        }
        client.say(channel, message);
    }
}

function followerAge(information) {
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
            if (usersBan.includes(username)) client.whisper(username, `@${username}, you are my follower is ${follow}`);
            else client.say(channel, `@${username}, you are my follower is ${follow}`);
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

function bigBrain(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const timers = information.timers;
    const array = ['Не будешь врагом и будешь другом тогда', 'Даймё много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь', 'Опоздал на стрим - йены не получил',
    'Не трать йены просто так, трать йены на награды', 'Кто сражается и следует за даймё, тот получает 250 йен', 'Победил - молодец, проиграл - jourloPressF', 'На каждое отверстие есть болт и хитрая гайка... А пробка - вещь неуничтожимая... Как легендарная набедренная повязка огра...', 'Да я и не спорю... С катаной в моих руках со мной почему-то никто не спорит...'];

    if (timers.bigBrain === 0) {
        client.say(channel, `@${username}, как говорил даймё, "${tools.randomElementFromArray(array)}"`);
        timers.bigBrain = 1;
        const func = () => timers.bigBrain = 0;
        setTimeout(func, tools.convertTime({minutes: 2}));
    }
}

function userage(information) {
    if (usersBan.includes(username) === true) return;
    client.api({
        url: `https://api.twitch.tv/kraken/users/${information.id}`,
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        const created_at = body.created_at;

        let now = new Date();
        let then = created_at;
        let ms = moment(now).diff(moment(then));
        let d = moment.duration(ms);
        let time = null;
        const days = Math.floor(d.asDays())
        if (days > 365) time = Math.floor(d.asYears()) + moment.utc(ms).format(":DDD:hh:mm");
        else time = Math.floor(d.asDays()) + moment.utc(ms).format(":hh:mm");
        const followSplited = time.split(':');
        let result = '';
        for (let i in followSplited) {
            if (i == 0) {
                if (followSplited.length === 4) result += `${followSplited[i]} years `;
                else result += `${followSplited[i]} days `;
            }
            if (i == 1) {
                if (followSplited.length === 4) result += `${followSplited[i]} days `;
                else result += `${followSplited[i]} hours `;
            }
            if (i == 2) {
                if (followSplited.length === 4) result += `${followSplited[i]} hours `;
                else result += `${followSplited[i]} minutes `;
            }
            if (i == 3) {
                if (followSplited.length === 4) result += `${followSplited[i]} minutes `;
            }
        }
        result += 'ago'
        client.say(channel, `@${username}, you created account ${result}`)
    });
}

function offtime(information) {
    if (usersBan.includes(username) === true) return;
    client.api({
        url: `https://api.twitch.tv/kraken/users/158466757`,
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        if (uptime != undefined) return;
        const created_at = body.updated_at;

        let now = new Date();
        let then = created_at;
        let ms = moment(now).diff(moment(then));
        let d = moment.duration(ms);
        const follow = Math.floor(d.asDays()) + moment.utc(ms).format(":hh:mm");
        const followSplited = follow.split(':');
        let result = '';
        for (let i in followSplited) {
            if (i == 0) result += `${followSplited[i]} days `;
            if (i == 1) result += `${followSplited[i]} hours `;
            if (i == 2) result += `${followSplited[i]} minutes`;
        }
        client.say(channel, `@${username}, Jourloy offline is ${result}`);
    });
}

function raid(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const result = Game.toRaid(username, client);
    if (result === errors.ERR_NOT_FIND_USER) client.say(channel, `@${username}, I can't find you in my database. You need choose fraction by this command: !fraction`);
    else if (result === errors.ERR_USER_NOT_IN_FRACTION) client.say(channel, `@JOURLOY, user [${username}] have data error (fraction error)`);
    else if (result === errors.ERR_ALREADY_IN_RAID) client.say(channel, `@${username}, you are in a raid. You can check time by this command: !status`);
    else if (result === errors.ERR_NOT_ENOUGH_SHARDS) client.say(channel, `@${username}, you are not have enough money for raid`);
}

function fraction(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const game = Database.get.game(username);
    if (game === errors.ERR_NOT_FIND_USER || game.fraction === '') {
        if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) client.say(channel, `@${username}, after !fraction you should write you fraction symbol`);
        else if (messageSplit[1] === 'V') {
            client.say(channel, `@${username}, good warrior, we are need this! Here is all easy, if you see a expensive things, then take it. When you will be ready for raid write !raid`);
            Database.add.user(username, messageSplit[1]);
        } else if (messageSplit[1] === 'C') {
            client.say(channel, `@${username}, Attention! Now this place is your new home. I have many tasks for you, when you will be ready for raid write !raid`);
            Database.add.user(username, messageSplit[1]);
        } else if (messageSplit[1] === 'J') {
            client.say(channel, `@${username} welcome. Now you are samurai. Protect katana as a wife and use wakizashi as a feather. When you will be ready for raid write !raid`);
            Database.add.user(username, messageSplit[1]);
        } else if (messageSplit[1] === 'K' && username === 'jourloy') {
            client.action(channel, `==> @${username}, now you not a simple man. Now you better other. You are in highest class. You are soul master. When you will be ready for raid write !raid`);
            Database.add.user(username, messageSplit[1]);
        }
    } else {
        if (game.fraction === 'C') client.say(channel, `@${username}, your fraction is the fight squad "Caesar" `);
        else if (game.fraction === 'V') client.say(channel, `@${username}, your fraction is the Vikings`);
        else if (game.fraction === 'J') client.say(channel, `@${username}, your fraction is the samurai clan "Sakura"`);
        else if (game.fraction === 'K') client.say(channel, `@${username}, your fraction is the Soul Master`);
    }
}

function wallet(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const raid = Database.get.raid(username);
    const hero = Database.get.hero(username);
    const game = Database.get.game(username);
    if (raid.inRaid === true) client.say(channel, `@${username}, you are in raid`);
    else {
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, I can't find you in my database. You need choose fraction by this command: !fraction`);
        else {
            if (game.fraction === 'C') client.say(channel, `@${username}, on your bill ${hero.wallet} купюр`);
            else if (game.fraction === 'V') client.say(channel, `@${username}, on your bill ${hero.wallet} gold coins`);
            else if (game.fraction === 'J') client.say(channel, `@${username}, on your bill ${hero.wallet} Great steel ignots`);
            else if (game.fraction === 'K') client.say(channel, `@${username}, on your bill ${hero.wallet} soul shards`);
        }
    }
}

function xp(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const hero = Database.get.hero(username);
    const game = Database.get.game(username);
    if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, I can't find you in my database. You need choose fraction by this command: !fraction`);
    else client.say(channel, `@${username}, you are have ${hero.level} level and ${hero.xp} experience points`);
}

function hp(information) {
    if (usersBan.includes(username) === true) return;
    const hero = Database.get.hero(username);
    const game = Database.get.game(username);
    if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, I can't find you in my database. You need choose fraction by this command: !fraction`);
    else client.say(channel, `@${username}, you are have ${hero.hp} heal points`);
}

function status(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
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

        client.say(channel, `@${username}, you are in raid. You will come back in ${formatted}`);
    } else client.say(channel, `@${username}, you are ready to go in raid. Use this command: !raid`);
}

function top(information) {
    if (usersBan.includes(username) === true) return;
    const username = information.username;
    const channel = information.channel;
    const fraction = Database.get.fraction(username);
    const top = Database.get.top(fraction);
    client.say(channel, `@${username}, в твоей фракции самый большой счет имеет ${top.username} на котором лежит ${top.wallet} валюты`);
}

/* CLASSES */
class adminChat {
    static check(information) {
        const username = information.username;
        const message = information.message;
        const command = information.command;
        const split = information.split;
        const channel = information.channel;
        let result = false

        if (command === 'ping') {
            result = true;
            client.action(channel, 'pong');
        } else if (command === 'stop') {
            client.action(channel, 'stopped');
            throw 'Stop'
        }

        return result;
    }
}

class chat {
    static check(information) {
        const username = information.username;
        const message = information.message;
        const command = information.command;
        const split = information.split;
        const channel = information.channel;
        const test = test();
        let result = false;

        if (command === 'q') {
            result = true;
            question(information);
        } else if (command === 'pc') {
            result = true;
            client.say(channel, `@${username}, Ryzen 5 5500x | MSI RX 580 | 16 GB RAM | Микрофон Razer Siren X`);
        } else if (command === 'youtube') {
            result = true;
            client.say(channel, `@${username}, YouTube channel: youtube.com/channel/UCpHyajrQHc29BHUYV1DwXvA`);
        } else if (command === 'discord') {
            result = true;
            client.say(channel, `@${username}, join in our discord community : discord.gg/zCATPVRp6p`);
        } else if (command === 'uptime') {
            result = true;
            getUptime(information);
        } else if (command === 'followerage') {
            result = true;
            followerAge(information);
        } else if (false && command === 'bigbrain') {
            result = true;
            commands.bigBrain(information);
        } else if (command === 'userage') {
            result = true;
            userage(information);
        } else if (command === 'offtime') {
            result = true;
            offtime(information);
        }

        if (test === false || username === 'jourloy') {
            if (command === 'raid') {
                result = true;
                raid(information);
            } else if (command === 'fraction') {
                result = true;
                fraction(information);
            } else if (command === 'wallet') {
                result = true;
                wallet(information);
            } else if (command === 'xp') {
                result = true;
                xp(information);
            } else if (command === 'hp') {
                result = true;
                hp(information);
            } else if (command === 'status') {
                result = true;
                status(information);
            } else if (command === 'top') {
                result = true;
                top(information);
            }
        }
        
        return result;
    }
}

class twitch {
    static whisper(username, message) {
        client.whisper(username, message);
    }

    static connect(twitchUsername, discordUsername) {
        const connectID = Database.get.connectID(twitchUsername);
        this.whisper(twitchUsername, `Hi, if you want connect your discord with twitch, then send in chat this: [ !connect ${connectID} to ${discordUsername} ] else just don't answer :)`);
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
    if (duration > 600) client.say(channel, `OMEGALUL => @${username}`);
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
    client.say(channel, `I'm first Kappa`);
})

client.on('redeem', (channel, username, rewardType, tags) => {
    if (rewardType === '57950914-5e2c-4f90-8474-69f1f0e70a49') {
        if (username === 'jourloy' || username === 'kartinka_katerinka') return;
        admin.timeout(channel, username, 600, 'Reward');
        console.log(`Twitch => Jourloy => Reward => Timeout (600) => ${username}`);
    }
});

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    /**
     * @deprecated
     */
    const username = userstate['display-name'].toLowerCase();
    /**
     * @deprecated
     */
    const messageSplit = message.split(' ');

    const user = Database.get.user_jr(username);
    if (user === errors.ERR_NOT_FIND_USER) Database.add.user_jr(username);
    if (ChatDefence.run(username, message, userstate, client) === false) return;
    Database.add.messages(username)

    const channelDB = Database.get.channel(channel);
    if (channelDB === errors.ERR_NOT_FIND_CHANNEL) Database.add.channel(channel);

    const information = {
        username: userstate['display-name'].toLowerCase(),
        id: userstate['user-id'],
        userstate: userstate,
        message: message,
        split: message.split(' '),
        command: message.split('!')[1],
        timers: Database.get.timers(userstate['display-name'].toLowerCase()),
        channel: channel,
    }

    if (information.username === 'jourloy') {
        if (adminChat.check(information) === true) return;
    }

    if (chat.check(information) === true) return;

    if (false && messageSplit[0] === '!connect') {

        const connectID = Database.get.connectID(username);
        if (messageSplit[1] == connectID) {
            client.say(channel, `@${username}, your discord connected to twitch`);
            Database.update.connectID(username, null);
            Database.update.discordUsername(username, messageSplit[3]);
        }

    } else if (false && messageSplit[0] === '!addWallet' && username === 'jourloy') {

        const data = Database.get.wallet(messageSplit[1]);
        const amount = parseInt(messageSplit[2])
        Database.add.wallet(messageSplit[1], amount);
        client.say(channel, `${data} --> ${data+amount}`);

    } else if (false && messageSplit[0] === '!addXp' && username === 'jourloy') {
        
        const data = Database.get.hero(messageSplit[1]).xp;
        const amount = parseInt(messageSplit[2])
        Database.add.xp(messageSplit[1], amount);
        client.say(channel, `${data} --> ${data+amount}`);

    } else if (false && messageSplit[0] === '!addLevel' && username === 'jourloy') {
        
        const data = Database.get.hero(messageSplit[1]).level;
        const amount = parseInt(messageSplit[2])
        Database.add.level(messageSplit[1], amount);
        client.say(channel, `${data} --> ${data+amount}`);

    } else if (false && messageSplit[0] === '!attack' && username === 'jourloy') {

        const result = Game.toAttack(username, messageSplit[1], client);
        if (result === errors.ERR_NOT_FIND_USER) client.say(channel, `@${username}, I can't find you in my database. You need choose fraction by this command: !fraction`);
        else if (result === errors.ERR_USER_NOT_IN_FRACTION) client.say(channel, `@JOURLOY, user [${username}] have data error (fraction error)`);
        else if (result === errors.ERR_ALREADY_IN_RAID) client.say(channel, `@${username}, you are in a raid. You can check time by this command: !status`);
        else if (result === errors.ERR_NOT_ENOUGH_SHARDS) client.say(channel, `@${username}, you are not have enough money for attack`);

    } else if (false && messageSplit[0] === '!buy' && username === 'jourloy') {

    } else if (false && messageSplit[0] === '!sell' && username === 'jourloy') {
        
    } else if (false && messageSplit[0] === '!inventory' && username === 'jourloy') {
        
    } else if (false && messageSplit[0] === '!use' && username === 'jourloy') {
        
    }
    
    if (message === 'Солнце мое, взгляни на меня') {
        client.say(channel, 'Моя ладонь превратилась в кулак catJAM');
    } else {
        
        if (false && channelTimers.repeat === 0) {
            const repeat = ['KEKW', 'KEKWait', 'PogChamp', 'LUL', 'Kappa'];
            for (let i in information.splited) if (repeat.includes(information.splited[i]) === true) {
                client.say(channel, information.splited[i]);
                return;
            }
            channelTimers.repeat = 1;
            setTimeout(function() {channelTimers.repeat = 0}, tools.convertTime({seconds: 60}));
        }

        if (message === '@JOURLOY_bot, ты бот?' || message === '@JOURLOY_bot ты бот?' || message === 'JOURLOY_bot, ты бот?' || message === 'JOURLOY_bot ты бот?') {
            client.say(channel, `@${username}, ты бот?`)
        }
        if (message === 'SMOrc SMOrc SMOrc SMOrc SMOrc') {
            client.say(channel, `SMOrc SMOrc SMOrc SMOrc SMOrc`);
        }
    }
});

/* EXPORTS */
module.exports.twitch = twitch;
