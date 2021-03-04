/* IMPORTS */
const { client } = require('./Bots/Jourloy_bot');
const { admin } = require('./Bots/Jourloy');

const { Game } = require('./game'); 
const { Tools, errors } = require('../Utils/tools');
const { discord } = require('./discord');
const moment = require('moment');
const { MongoClient } = require("mongodb");

/* PARAMS */
let uptime = undefined;
let viewers = 0;
let maxViewers = 0;
let gameHistory = [];
let channelTimers = {
    repeat: 0,
}

let database = null;
let userCollection = null;
let twitchCollection = null;

const uri = "mongodb://192.168.0.104:12702/";
const clientDB = new MongoClient(uri);
clientDB.connect().then( err => {
    database = clientDB.db('TwitchBot');
    userCollection = database.collection('users');
    twitchCollection = database.collection('twitch');
})

const usersBan = [];

/* INTERVALS */
/* setInterval(function () {
    if (uptime != null && game != null) {
        const splitedUptime = uptime.split(' ');
        if (splitedUptime[0] === '0' && splitedUptime[2] === '2' && splitedUptime[4] === '00') discord.noftification(game);
    }
}, Tools.convertTime({seconds: 1}));

setInterval(function () {
    const send = Game.send();

    for (let i in send) {
        client.say(client.channel, send[i].message);
        delete send[i];
        return;
    }
}, Tools.convertTime({seconds: 5}))

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
}, Tools.convertTime({seconds: 1})); */

/* FUNCTIONS */
function testF() {
    let result = true;
    try { require('./test') }
    catch { result = false }
    return result;
}

function question(information) {
    const array = ['yes','no','maybe', '50%', 'I don\'t want answer','strange question','Maybe you will ask other question?','I don\'t know', 'I know, but I don\'t want answer', 'no, please, nooo'];
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;

    userCollection.findOne({username: username}).then((user) => {
        if (user == null || user === []) return;
        if (user.timers != null && user.timers.question != null && user.timers.question === 1) return;
        client.say(channel, `@${username}, ${Tools.randomElementFromArray(array)}`);
        const upd = {
            timers: {
                question: 1,
            },
        }
        userCollection.updateOne({username: username}, {$set: upd});
        setTimeout(function() {
            const upd = {
                timers: {
                    question: 0,
                },
            }
            userCollection.updateOne({username: username}, {$set: upd});
        }, 10000);
    });
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
                client.say(channel, `@${username}, you are follower?`);
                return;
            }
            let now = new Date();
            let then = body.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов, mm минут и ss секунд");

            userCollection.findOne({username: username}).then((user) => {
                if (user == null || user === []) return;
                if (user.timers != null && user.timers.followerage != null && user.timers.followerage === 1) return;
                else {
                    if (usersBan.includes(username)) client.whisper(username, `@${username}, you are my follower is ${follow}`);
                    else client.say(channel, `@${username}, you are my follower is ${follow}`);

                    const upd = {
                        timers: {
                            followerage: 1,
                        },
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                    setTimeout(function() {
                        const upd = {
                            timers: {
                                followerage: 0,
                            },
                        }
                        userCollection.updateOne({username: username}, {$set: upd});
                    }, 10000);
                }
            });
        })
    } catch (e) {}
}

function bigBrain(information) {
    return;
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;
    const array = ['Не будешь врагом и будешь другом тогда', 'Даймё много, а твой - один', 'Не страшно, если целился высоко и не попал, страшно, если смотришь и не зафоловлен на канал', 'Зритель к стриму дорог', 'Колу не прольешь - не попьешь', 'Опоздал на стрим - йены не получил',
    'Не трать йены просто так, трать йены на награды', 'Кто сражается и следует за даймё, тот получает 250 йен', 'Победил - молодец, проиграл - jourloPressF', 'На каждое отверстие есть болт и хитрая гайка... А пробка - вещь неуничтожимая... Как легендарная набедренная повязка огра...', 'Да я и не спорю... С катаной в моих руках со мной почему-то никто не спорит...'];

    if (timers.bigBrain === 0) {
        client.say(channel, `@${username}, как говорил даймё, "${Tools.randomElementFromArray(array)}"`);
        timers.bigBrain = 1;
        const func = () => timers.bigBrain = 0;
        setTimeout(func, Tools.convertTime({minutes: 2}));
    }
}

function userage(information) {
    const username = information.username;
    const channel = information.channel;
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
    const username = information.username;
    const channel = information.channel;
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
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;
    
    userCollection.findOne({username: username}).then((user) => {
        if (user.game == null) {
            client.say(channel, `@${username}, I can't find you in my database, use !fraction`);
            return;
        } else if (user.game.fraction == null) {
            client.say(channel, `@${username}, I can't find you in my database, use !fraction`);
            return;
        } else if (user.game.inRaid === true) {
            client.say(channel, `@${username}, you already in raid, check your status by this command: !status`);
            return;
        } else if (user.game.wallet < 1) {
            client.say(channel, `@${username}, you have not enough money for raid`);
            return;
        } else {
            Game.toRaid(username, client, userCollection);
            return;
        }
    });
}

function fraction(information) {
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;

    if (information.split[1] == null || (information.split[1] !== 'V' && information.split[1] !== 'J' && !information.split[1] !== 'C' && (information.split[1] !== 'K' && username !== 'jourloy'))) {
        client.say(channel, `@${username}, after !fraction you should write you fraction symbol`);
        return;
    }

    let gm = {
        game: {},
    }
    userCollection.findOne({username: username}).then((user) => {
        if (user == null || user == []) return;
        if (user.game == null) {
            userCollection.updateOne({username: username}, {$set: gm}).then((user) => {
                if (information.split[1] === 'V') {
                    client.say(channel, `@${username}, good warrior, we are need this! Here is all easy, if you see a expensive things, then take it. When you will be ready for raid write !raid`);
                    let upd = {
                        game: {
                            wallet: 5,
                            fraction: 'V',
                            hero: {
                                level: 1,
                                xp: 0,
                                hp: 100,
                            }
                        }
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                } else if (information.split[1] === 'C') {
                    client.say(channel, `@${username}, Attention! Now this place is your new home. I have many tasks for you, when you will be ready for raid write !raid`);
                    let upd = {
                        game: {
                            wallet: 5,
                            fraction: 'C',
                            hero: {
                                level: 1,
                                xp: 0,
                                hp: 100,
                            }
                        }
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                } else if (information.split[1] === 'J') {
                    client.say(channel, `@${username}, welcome. Now you are samurai. Protect katana as a wife and use wakizashi as a feather. When you will be ready for raid write !raid`);
                    let upd = {
                        game: {
                            wallet: 5,
                            fraction: 'J',
                            hero: {
                                level: 1,
                                xp: 0,
                                hp: 100,
                            }
                        }
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                } else if (information.split[1] === 'K' && username === 'jourloy') {
                    client.say(channel, `@${username}, now you not a simple man. Now you better other. You are in highest class. You are soul master. When you will be ready for raid write !raid`);
                    let upd = {
                        game: {
                            wallet: 50,
                            fraction: 'K',
                            hero: {
                                level: 5,
                                xp: 0,
                                hp: 100,
                            }
                        }
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                }
            });
        } else {
            if (user.game.fraction != null) {
                client.say(channel, `@${username}, your fraction is ${user.game.fraction}`);
                return;
            }
        }
    });
}

function wallet(information) {
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;

    userCollection.findOne({username: username}).then(user => {
        if (user == null && user === []) return;
        else if (user.game == null) client.say(channel, `@${username}, I can't find you in my database, use !fraction for register`);
        else if (user.game.wallet == null) console.log(`Database => Error => ${username} => Wallet`);
        else {
            if (user.game.fraction === 'V') client.say(channel, `@${username}, on your bill ${user.game.wallet} gold coins`);
            if (user.game.fraction === 'J') client.say(channel, `@${username}, on your bill ${user.game.wallet} Great steel ingots`);
            if (user.game.fraction === 'C') client.say(channel, `@${username}, on your bill ${user.game.wallet} money`);
            if (user.game.fraction === 'K') client.say(channel, `@${username}, on your bill ${user.game.wallet} soul shards`);
        }
    });
}

function hero(information) {
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;
    userCollection.findOne({username:username}).then(user => {
        if (user == null && user === []) return;
        else if (user.game == null) client.say(channel, `@${username}, I can't find you in my database, use !fraction for register`);
        else if (user.game.hero == null) console.log(`Database => Error => ${username} => Hero`);
        else {
            client.say(channel, `@${username}, you have a ${user.game.hero.level} level (${user.game.hero.xp}/${user.game.hero.level * 100 + (user.game.hero.level * 15)}) and ${user.game.hero.hp} heal points`);
        }
    });
}

function status(information) {
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;
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
    const username = information.username;
    const channel = information.channel;
    if (usersBan.includes(username) === true) return;
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
        const test = testF();
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
        } else if (command === 'vikings') {
            result = true;
            client.say(channel, `VIKINGS: +2% reward, -15% speed`);
        } else if (command === 'caesar') {
            result = true;
            client.say(channel, `CAESAR: +5% speed, -3% xp, 2% discount`);
        } else if (command === 'samurai') {
            result = true;
            client.say(channel, `SAMURAI: +3% xp, -15% speed, -2% reward`);
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
            } else if (command === 'hero') {
                result = true;
                hero(information);
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

async function getUser(username) {
    const data = await database.get.user(username);
    return data;
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

    client.timeout(username, Tools.convertTime({seconds: 10}));
    console.log(`Twitch => Timeout (10) => ${username}`);
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
    if (userCollection == null) return;
    const username = userstate['display-name'].toLowerCase();
    if (username === 'jourloy_bot') return;
    const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';

    userCollection.findOne({username: username}).then((user) => {
        if (user == null || user === []) userCollection.insertOne({username: username});
    });

    for (let i in message) {
        if (ru_alphabet.includes(message[i]) === true) {
            if (username === 'jourloy') {
                console.log('Twitch => Jourloy => Delete message');
                return;
            } else {
                console.log(`Twitch => Jourloy => Delete message => ${username}`);
                client.deletemessage(channel, userstate['id']);
                return;
            }
        }
    }

    if (username !== 'jourloy') return;

    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const information = {
        username: userstate['display-name'].toLowerCase(),
        id: userstate['user-id'],
        userstate: userstate,
        message: message,
        split: messageSplit,
        command: msSplit[1],
        channel: channel,
    }

    if (information.username === 'jourloy') {
        if (adminChat.check(information) === true) return;
    }

    if (chat.check(information) === true) return;
});

/* EXPORTS */
module.exports.twitch = twitch;
