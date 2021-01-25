/* IMPORTS */
const { JsonDB } = require('node-json-db');

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
}

/* ERRORS */
const ERR_NOT_FIND_USER = 'ERR_NOT_FIND_USER';
const ERR_USER_ALREADY_EXIST = 'ERR_USER_ALREADY_EXIST';
const NOT_ENOUGH_COINS = 'NOT_ENOUGH_COINS';

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
        for (let i in db) if (i === username) return db[i].coins;
        return ERR_NOT_FIND_USER;
    }

    /**
     * 
     * @param {String} username 
     */
    static addUser(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return ERR_USER_ALREADY_EXIST;

        const user = {
            username: username,
            messages: 0,
            warnings: 0,
            coins: 10,
            inv: [],
        }

        db[username] = user;
        database.push('/Users', db, true);
        return true;
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

        db[username].coins += amount;
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

        db[username].coins -= amount;
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
            else user = null;
            return user;
        }
        else return ERR_NOT_FIND_USER;
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