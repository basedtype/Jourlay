/* IMPORTS */
const { client } = require('./Bots/Jourloy_bot');
const { admin } = require('./Bots/Jourloy');

const { Game } = require('./game'); 
const { tools, errors } = require('../Utils/tools');
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

const usersBan = ['anna_scorpion05'];

/* INTERVALS */
/*setInterval(function () {
    if (uptime != null && game != null) {
        const splitedUptime = uptime.split(' ');
        if (splitedUptime[0] === '0' && splitedUptime[2] === '2' && splitedUptime[4] === '00') discord.noftification(game);
    }
}, tools.convertTime({seconds: 1}));*/

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
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        }
    })
}, tools.convertTime({seconds: 1}));

/* REACTION */
/* client.on("cheer", (channel, userstate, message) => {
    const bits = userstate.bits;
    if (bits <= 100) client.action(channel, `==> Спасибо за ${bits}, @${username}. Мне приятно`);
    if (bits > 100 && bits <= 500) client.action(channel, `==> Воу, @${username}, спасибо за щедрость, мне приятно`);
    if (bits > 500 && bits <= 1000) client.action(channel, `==> ОМГ, сегодня не день, сегодня счастье. Спасибо за ${bits}, @${username}`);
    if (bits > 1000 && bits <= 2000) client.action(channel, `==> Благодаря @${username} я, кажется, сейчас выключу стрим и пойду кайфовать`);
    if (bits > 2000) client.action(channel, `==> @${username}, жесть ты шейх, спасибо тебе огромное. Перееду на днях в Дубаи, я думаю денег теперь мне хватит`);
}); */

client.on("timeout", (channel, username, reason, duration) => {
    if (duration > 600) client.say(channel, `OMEGALUL => @${username}`);
});

client.on("raided", (channel, username, viewers) => {
    client.action(channel, `==> Thank you very much, ${username}, for raid and thank all ${viewers} viewers for join in raid!`);
});

client.on('action', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    if (userstate.mod === true || username === 'jourloy' || username === 'kartinka_katerinka') return;

    client.timeout(username, tools.convertTime({seconds: 10}));
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
    if (self) return;
    if (userCollection == null) return;
    const username = userstate['display-name'].toLowerCase();
    const id = userstate['user-id'];
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    if (username === 'jourloy') {
        if (command === 'ping') {

            client.action(channel, `pong`);
            return;

        }
    }

    if (command === 'uptime') {

        if (uptime == undefined) client.say(channel, `Streamer is offline now`);
        else {
            let message = `Stream uptime: ${uptime} | Games on stream: `
            for (let i in gameHistory) {
                if (i == 1) message += gameHistory[i];
                else message += ` -> ${gameHistory[i]}`;
            }
            client.say(channel, message);
        }
        return;

    } else if (command === 'q') {

        const array = ['yes','no','maybe', '50%', 'I don\'t want answer','strange question','Maybe you will ask other question?','I don\'t know', 'I know, but I don\'t want answer', 'no, please, nooo'];
        if (usersBan.includes(username) === true) return;
    
        userCollection.findOne({username: username}).then((user) => {
            if (user == null || user === []) return;
            if (user.timers != null && user.timers.question != null && user.timers.question === 1) return;
            client.say(channel, `@${username}, ${tools.randomElementFromArray(array)}`);
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
            }, tools.convertTime({seconds: 10}));
        });
        return;

    } else if (command === 'followerage') {

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
                        }, tools.convertTime({seconds: 10}));
                    }
                });
            })
        } catch (e) {}
        return;

    } else if (command === 'userage') {
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
        return;

    } else if (command === 'pc') {

        client.say(channel, `@${username}, Ryzen 5 5500x | MSI RX 580 | 16 GB RAM | Микрофон Razer Siren X`);
        return

    } else if (command === 'youtube') {

        client.say(channel, `@${username}, YouTube channel: youtube.com/channel/UCpHyajrQHc29BHUYV1DwXvA`);
        return;

    } else if (command === 'discord') {

        client.say(channel, `@${username}, join in our discord community: discord.gg/zCATPVRp6p`);
        return;

    }
});
