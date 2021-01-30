/* IMPORTS */
const tmi = require('tmi.js');
const moment = require('moment');
const { _ } = require('../tools');
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
        password: 'oauth:byyl8cmaubs3ucz72zkmcm69yq2bhk'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
client.botName = options.identity.username;
client.lang = 'ru';
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('JapanBank => Twitch => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* PARAMS */
let stopRaid = true;

/* FUNCTIONS */

/* INTERVALS */

/* REACTIONS */
client.on('redeem', (channel, username, rewardType, tags) => {
    if (rewardType === '6aa74658-1b0a-49ed-8bc2-2ff0de3f6cef') {
        client.say(channel, `@${username}, отлично, я перевел 10 осколоков душ на ваш счет. Проверить кошелек можно командой !wallet`);
        Database.addCoins(username, 10);
    }
});

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');

    if (Database.getUser(username) === 'ERR_NOT_FIND_USER') Database.create(username, userstate, client);
    Database.addMessage(username);

    if (messageSplit[0] === '!stop') {
        if (username !== 'jourloy') return;
        throw 'Exit';
    } else if (messageSplit[0] === '!wallet' || messageSplit[0] === '!w') {
        if (username === 'jourloy') {
            const to = messageSplit[1];
            client.say(channel, `@${username}, у ${to} на счету ${Database.getCoins(to)} осколков душ`);
        } else client.say(channel, `@${username}, у вас на счету ${Database.getCoins(username)} осколков душ`);
        return;
    } else if (messageSplit[0] === '!buy' || messageSplit[0] === '!b') {
        if (username !== 'jourloy') client.say(channel, `@${username}, магазин в данный момент не доступен`);
        return;
    } else if (messageSplit[0] === '!inventory' || messageSplit[0] === '!i') {
        if (username !== 'jourloy') client.say(channel, `@${username}, склад в данный момент не доступен`);
        return;
    } else if (messageSplit[0] === '!raid' || messageSplit[0] === '!r') {
        if (stopRaid === false || username === 'jourloy') Coins.raid(username, client);
        else client.say(channel, `@${username}, в данный момент ворота из города закрыта, выйти не возможно`);
        return;
    } else if (messageSplit[0] === '!exp' || messageSplit[0] === '!e') {
        const exp = Database.getExp(username);
        client.say(channel, `@${username}, у вас ${exp.points} очков опыта и ${exp.level} уровень`);
        return;
    } else if (messageSplit[0] === '!stock') {
        if (username !== 'jourloy') client.say(channel, `@${username}, акции в данный момент не доступны`);
        return;
    } else if (messageSplit[0] === '!send') {
        if (username !== 'jourloy') client.say(channel, `@${username}, перевод в данный момент не доступен`);
        return;
    } else if (messageSplit[0] === '!addShards') {
        if (username !== 'jourloy') return;
        const shards = parseInt(messageSplit[1]);
        const to = messageSplit[2];
        Database.addCoins(to, shards);
        client.say(channel, `@${username}, ${shards} осколков душ зачислено на счет, владельцем которого является ${to}`);
        return;
    } else if (messageSplit[0] === '!removeShards') {
        if (username !== 'jourloy') return;
        const shards = parseInt(messageSplit[1]);
        const to = messageSplit[2];
        Database.removeCoins(to, shards);
        client.say(channel, `@${username}, ${shards} осколков душ убрано со счета, владельцем которого является ${to}`);
        return;
    } else if (messageSplit[0] === '!курс') {
        client.action(channel, `==> Текущий курс йен по отношению к осколкам душ: 100 йен на 1 осколок`);
        return;
    } else if (messageSplit[0] === '!top') {
        const user = Database.getTop();
        client.action(channel, `==> Самый большой счет у ${user.username} на котором лежит ${user.wallet} осколков душ`);
        return;
    } else if (messageSplit[0] === '!stopRaid') {
        if (username !== 'jourloy') return;
        client.action(channel, `==> Ворота из города ЗАКРЫТЫ, установлены посты охраны`);
        stopRaid = true;
        return;
    } else if (messageSplit[0] === '!allowRaid') {
        if (username !== 'jourloy') return;
        client.action(channel, `==> Ворота из города ОТКРЫТЫ, посты охраны убраны`);
        stopRaid = false;
        return;
    } else if (messageSplit[0] === '!return') {
        const mes = Coins.returnRaid(username);
        client.say(channel, `@${username}, ${mes}`);
        return;
    } else if (messageSplit[0] === '!pay' || messageSplit[0] === '!p') {
        const raid = Database.getRaid(username);
        const wallet = Database.getCoins(username);

        if (raid.return === true && raid.pay > 0) {
            if (wallet < raid.pay) {
                client.say(channel, `@${username}, на вам счету не хватает осколов душ для оплаты возвращения`);
                return;
            } else {
                Database.removeCoins(username, raid.pay);
                let time = _.randomInt(1200, 3000);
                if (username === 'jourloy') time = 33;
                let hours = Math.floor(time/60/60);
                let minutes = Math.floor(time/60)-(hours*60);
                let seconds = time%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, отряд отправился на ваши поиски. Возвращение в город займет ${formatted}`);

                const userRaid = Database.getRaid(username);
                userRaid.created_at = Math.floor(moment.now() / 1000);
                userRaid.time = time;
                userRaid.pay = 0;
                const timerID = userRaid.timerID;
                Database.updateRaid(username, userRaid);
                const id = timerID.split(' ')[1];
                clearTimeout(id);
                setTimeout(function() {
                    const raid = Database.getRaid(username);
                    raid.bool = false;
                    raid.rest = false;
                    raid.created_at = null;
                    raid.time = null;
                    raid.pay = 0;
                    raid.return = false;
                    Database.updateRaid(username, raid);
                    client.say(client.channel, `${username}, вы успешно возвращены в город`);
                    console.log(`JapanBank => Twitch => Raid => ${username} => End rest`);
                }, _.convertTime(time));
            }
        }
        return;
    }  else if (messageSplit[0] === '!status' || messageSplit[0] === '!s') {
        if (username === 'jourloy') {
            const raid = Database.getRaid(messageSplit[1]);
            if (raid.bool === true && raid.rest === false && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} находится в рейде. До возвращения еще ${formatted}`);
            } else if (raid.bool === true && raid.rest === true && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} восстанавливает силы. До полного восстановления ${formatted}`);
            } else if (raid.bool === true && raid.return === true && raid.pay === 0) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} возвращается отрядом. До возвращения еще ${formatted}`);
            } else client.say(channel, `@${username}, ${messageSplit[1]} готов отправиться в запретные земли`);
        } else {
            const raid = Database.getRaid(username);
            if (raid.bool === true && raid.rest === false && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

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
            } else if (raid.bool === true && raid.rest === true && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, вы восстанавливаете силы. До полного восстановления ${formatted}`);
            } else if (raid.bool === true && raid.return === true && raid.pay === 0) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, вы возвращаетесь отрядом. До возвращения еще ${formatted}`);
            } else client.say(channel, `@${username}, вы готовы отправиться в запретные земли. Пропуск стоит 10 осколков душ. Отправиться в рейд можно командой !raid`);
        }
        return;
    }
});