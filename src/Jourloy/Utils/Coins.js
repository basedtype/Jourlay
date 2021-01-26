/* IMPORTS */
const { JsonDB } = require('node-json-db');
const { _ } = require('../tools');
const { ChatUser } = require('./ChatUser');

/* PARAMS */
const database = new JsonDB('Data/Users', true, true, '/');
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
try { database.getData('/Users') } 
catch { database.push('/Users', {}, true) }

/* CLASSES */
class Coins {
    static help(client) {
        client.action(client.channel, `==> учавствуя в мини-играх и просто общаясь в чате, ты получаешь на свой счет в ДжапанБанке "осколки душ". Их можно тратить на награды и участие в платных мини-играх. Они отличаются от йен только способом получения. В будущем йены можно будет конвентировать в осколки душ`);
        return true;
    }

    /**
     * 
     * @param {String} username 
     */
    static getAmount(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].wallet;
        return ERR_NOT_FIND_USER;
    }

    /**
     * 
     * @param {String} username 
     * @param {Number} amount 
     */
    static plusCoins(username, amount) {
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i];
        if (user == null) return ERR_NOT_FIND_USER;

        db[username].wallet += amount;
        database.push('/Users', db, true);
        return true;
    }

    /**
     * 
     * @param {String} username 
     * @param {Number} amount 
     */
    static minusCoins(username, amount) {
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i];
        if (user == null) return ERR_NOT_FIND_USER;

        db[username].wallet -= amount;
        database.push('/Users', db, true);
        return true;
    }

    /**
     * 
     * @param {String} username 
     * @param {Boolean} array
     */
    static getInv(username, array) {
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i].inv;
        if (user != undefined) {
            if (user.length > 0) {
                if (array == null || array === false) user = user.join(', ');
            }
            else user = [];
            return user;
        }
        else return ERR_NOT_FIND_USER;
    }

    static raid(username, client) {
        const coins = this.getAmount(username);
        if (coins < price.raid) return ERR_NOT_ENOUGH_COINS;
        this.minusCoins(username, 10);
        const userRaid = ChatUser.getRaid;
        if (userRaid.bool === true) return ERR_ALREADY_IN_RAID;

        userRaid.bool = true;
        ChatUser.updateRaid(username, userRaid);

        const inventory = this.getInv(username, true);
        let lucky = 80;
        if (inventory.includes('Броня 1 уровня') === true) lucky += 1;
        if (inventory.includes('Броня 2 уровня') === true) lucky += 3;
        if (inventory.includes('Броня 3 уровня') === true) lucky += 5;
        if (inventory.includes('Оружие 1 уровня') === true) lucky += 1;
        if (inventory.includes('Оружие 2 уровня') === true) lucky += 3;
        if (inventory.includes('Оружие 3 уровня') === true) lucky += 5;
        if (inventory.includes('Еда') === true) lucky += 5;
        let fail = _.randomInt(0, 100);

        if (lucky >= fail) fail = false;
        if (lucky < fail) fail = true;

        fail = false; // Will change. Because small chat

        let time = undefined;
        if (lucky === false) time = _.randomInt(7200, 32340);
        else time = _.randomInt(7200, 10800);

        if (username === 'jourloy' || username === 'kartinka_katerinka') time = 65;

        let hours = Math.floor(time/60/60);
        let minutes = Math.floor(time/60)-(hours*60);
        let seconds = time%60

        const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');

        client.say(client.channel, `@${username}, ДжапанБанк предоставляет вам одноразовую лицензию для прохода в запретные земли. Если вы вернете ее, то получите обратно свои осколки душ. Спасибо, что пользуетесь ДжапанБанк. Вы вернетесь в город через ${formatted}`);

        setTimeout(function() {
            let shards = null;
            let exp = null;
            if (hours < 3) {
                shards = _.randomInt(20, 50);
                exp = _.randomInt(5, 10);
            } else if (hours >= 3 && hours < 4) {
                shards = _.randomInt(30,60);
                exp = _.randomInt(10, 15);
            } else if (hours >= 4 && hours < 5) {
                shards = _.randomInt(40, 70);
                exp = _.randomInt(15, 20);
            } else {
                shards = _.randomInt(50, 80);
                exp = _.randomInt(25, 30);
            }

            const rest = _.randomInt(50, 80);
            client.say(client.channel, `@${username}, вылазка окончена. ДжапанБанк рад видеть вас! Вы получаете ${shards} осколков на счет, а также ${exp} очков опыта. Отдых займет ${rest} минут`);
            userRaid.rest = true;
            ChatUser.updateRaid(username, userRaid);
            Coins.plusCoins(username, shards);
            ChatUser.addExp(username, exp, client);

            setTimeout(function() {
                const raid = ChatUser.getRaid(username);
                raid.bool = false;
                raid.rest = false;
                ChatUser.updateRaid(username, raid);
            }, _.convertTime(rest*60));

        }, _.convertTime(time));
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