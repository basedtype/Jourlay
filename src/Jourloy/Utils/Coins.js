/* IMPORTS */
const moment = require('moment');
const { _ } = require('../tools');
const { Database } = require('./Database');

/* PARAMS */
const price = {
    eat: 5,
    armour: {
        lvl1: 20,
        lvl2: 25,
        lvl3: 30,
    },
    weapon: {
        lvl1: 20,
        lvl2: 25,
        lvl3: 30,
    },
    powder: 5,
    goldStatue: 7,
    silverStatue: 5,
    ironStatue: 3,
    subStone: 1000000,
    raid: 10,
}

/* ERRORS */
const ERR_NOT_FIND_USER = 'ERR_NOT_FIND_USER';
const ERR_USER_ALREADY_EXIST = 'ERR_USER_ALREADY_EXIST';
const ERR_NOT_ENOUGH_COINS = 'NOT_ENOUGH_COINS';
const ERR_ALREADY_IN_RAID = 'ERR_ALREADY_IN_RAID';

/* CODE */

/* CLASSES */
class Coins {
    static help(client) {
        client.action(client.channel, `==> учавствуя в мини-играх и просто общаясь в чате, ты получаешь на свой счет в ДжапанБанке "осколки душ". Их можно тратить на награды и участие в платных мини-играх. Они отличаются от йен только способом получения`);
        return true;
    }

    static raid(username, client) {
        const coins = Database.getCoins(username);
        if (coins < price.raid) return ERR_NOT_ENOUGH_COINS;

        let userRaid = Database.getRaid(username);
        if (userRaid.bool === true) return ERR_ALREADY_IN_RAID;

        Database.removeCoins(username, price.raid);
        userRaid.bool = true;
        userRaid.created_at = Math.floor(moment.now() / 1000);

        let time = _.randomInt(7200, 14400);

        if (username === 'jourloy' || username === 'kartinka_katerinka') time = 65;

        let hours = Math.floor(time/60/60);
        let minutes = Math.floor(time/60)-(hours*60);
        let seconds = time%60

        const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');

        userRaid.time = time;
        Database.updateRaid(username, userRaid);

        client.say(client.channel, `@${username}, ДжапанБанк предоставляет вам одноразовый пропуск для прохода в запретные земли. Если вы вернете его, то получите обратно свои осколки душ. Вы вернетесь в город через ${formatted}. Узнать оставшееся время можно командой !status`);
        console.log(`JapanBank => Twitch => Raid => ${username} => Start raid => ${formatted}`);

        const timerIDMain = setTimeout(function() {
            let shards = null;
            let exp = null;
            if (hours < 3) {
                shards = _.randomInt(20, 55);
                exp = _.randomInt(5, 10);
            } else if (hours >= 3 && hours < 4) {
                shards = _.randomInt(30, 65);
                exp = _.randomInt(10, 15);
            } else if (hours >= 4 && hours < 5) {
                shards = _.randomInt(40, 80);
                exp = _.randomInt(15, 20);
            }

            let rest = _.randomInt(30, 45);
            if (username === 'jourloy') rest = 1;
            const Raid = Database.getRaid(username);
            Raid.time = rest*60;
            client.say(client.channel, `@${username}, вылазка окончена. ДжапанБанк рад видеть вас! Вы получаете ${shards} осколков на счет, а также ${exp} очков опыта. Проверить счет можно командой !wallet, а уровень командой !exp. Отдых займет ${rest} минут`);
            console.log(`JapanBank => Twitch => Raid => ${username} => End raid => ${rest}`);
            Raid.rest = true;
            Raid.created_at = Math.floor(moment.now() / 1000);
            Raid.pay = 0;
            Raid.return = false;
            Raid.timerID = "";
            Database.updateRaid(username, Raid);
            Database.addCoins(username, shards + price.raid);
            Database.addExp(username, exp, client);

            const timerID_rest = setTimeout(function() {
                const raid = Database.getRaid(username);
                raid.bool = false;
                raid.rest = false;
                raid.created_at = null;
                raid.time = null;
                raid.timerID = "";
                Database.updateRaid(username, raid);
                client.say(client.channel, `${username}, вы отдохнули и готовы вновь отправиться на вылазку (!raid)`);
                console.log(`JapanBank => Twitch => Raid => ${username} => End rest`);
            }, _.convertTime(rest*60));

            const userRaid = Database.getRaid(username);
            userRaid.timerID = "! " + timerID_rest;
            Database.updateRaid(username, userRaid);

        }, _.convertTime(time));

        const raid = Database.getRaid(username);
        raid.timerID = "! " + timerIDMain;
        Database.updateRaid(username, raid);
    }

    static returnRaid(username, pay, client) {
        if (pay === false) {
            const raid = Database.getRaid(username);
            if (raid.bool === true && raid.rest === true) client.say(client.channel, `@${username}, вы уже вернулись из рейда и сейчас отдыхаете. Команда !status чтобы узнать время до конца отдыха`);
            if (raid.bool === false) client.say(client.channel, `@${username}, вы сейчас находитесь не в рейде. Команда !raid для того, чтобы отправиться на поиски осколков`);
            if (raid.return === true) {
                if (raid.pay === 0) client.say(client.channel, `@${username}, вы уже ожидаете выхода из рейда`);
                if (raid.pay !== 0) client.say(client.channel, `@${username}, вам необходимо оплатить возвращение в количестве ${raid.pay} осколков душ. Команда !pay для оплаты`);
            }

            const pay = _.randomInt(70, 200);
            raid.pay = pay;
            raid.return = true;
            Database.updateRaid(username, raid);
            client.say(client.channel, `@${username}, команда возврата готова выдвигаться, оплатите возврат стоимостью ${pay} осколков душ при помощи команды !pay`);
        } else {
            const raid = Database.getRaid(username);
            const wallet = Database.getCoins(username);

            if (raid.return === true && raid.pay > 0) {
                if (wallet < raid.pay) {
                    client.say(client.channel, `@${username}, на вам счету не хватает осколов душ для оплаты возвращения`);
                    return;
                } else {
                    Database.removeCoins(username, raid.pay);
                    let time = _.randomInt(600, 900);
                    if (username === 'jourloy') time = 33;
                    let hours = Math.floor(time/60/60);
                    let minutes = Math.floor(time/60)-(hours*60);
                    let seconds = time%60

                    const formatted = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');

                    client.say(client.channel, `@${username}, отряд отправился на ваши поиски. Возвращение в город займет ${formatted}`);

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
                        client.say(client.channel, `@${username}, вы успешно возвращены в город`);
                        console.log(`JapanBank => Twitch => Raid => ${username} => End rest`);
                    }, _.convertTime(time));
                }
            }
        }
    }

    /**
     * 
     * @param {String} username 
     * @param {String} message 
     * @param {Number} amount 
     */
    static buy(username, message, client) {
        const split = message.split(' ');
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i].inv;
        if (user != undefined) {
            const coins = this.getAmount(username);
            switch (split[1]) {
                case 'eat':
                    if (coins < price.eat) return NOT_ENOUGH_COINS;
                    this.minusCoins(username, price.eat);
                    user.push('Еда');
                    client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    break;
                case 'armour':
                    if (split[2] == 1) {
                        if (coins < price.armour.lvl1) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.armour.lvl1);
                        user.push('Броня 1 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    } else if (split[2] == 2) {
                        if (coins < price.armour.lvl2) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.armour.lvl2);
                        user.push('Броня 2 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    } else if (split[2] == 3) {
                        if (coins < price.armour.lvl3) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.armour.lvl3);
                        user.push('Броня 3 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    }
                    break;
                case 'weapon':
                    if (split[2] == 1) {
                        if (coins < price.weapon.lvl1) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.weapon.lvl1);
                        user.push('Оружие 1 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    } else if (split[2] == 2) {
                        if (coins < price.weapon.lvl2) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.weapon.lvl2);
                        user.push('Оружие 2 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    } else if (split[2] == 3) {
                        if (coins < price.weapon.lvl3) return NOT_ENOUGH_COINS;
                        this.minusCoins(username, price.weapon.lvl3);
                        user.push('Оружие 3 уровня');
                        client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    }
                    break;
                case 'subStone':
                    if (coins < price.subStone) return NOT_ENOUGH_COINS;
                    this.minusCoins(username, price.subStone);
                    user.push('Камень Подписки');
                    client.say(client.channel, `@${username}, поздравляю с покупкой!`);
                    break;
            }
            db[username].inv = user;
            database.push('/Users', db, true);
        }
        else return ERR_NOT_FIND_USER;
    }
}

/* EXPORTS */
module.exports.Coins = Coins;